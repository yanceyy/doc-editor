import type {
    DocEditorConfigOptions,
    Element,
    ElementAttribute,
    ElementType,
    EventType,
    Row,
} from "shared/Types";
import { HistoryTracker, deepClone } from "shared/utils";

function canvasToBlob(canvas: HTMLCanvasElement) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error("Unable to convert canvas to Blob"));
            }
        });
    });
}

export class BoardCanvas {
    container: HTMLElement;
    data: Element[];
    options: DocEditorConfigOptions;
    pageCanvasList: HTMLCanvasElement[];
    pageCanvasCtxList: CanvasRenderingContext2D[];
    rows: Row[];
    observers: Partial<Record<EventType, ((context: BoardCanvas) => void)[]>>;
    cursorPositionIndex: number;
    selectedRange: number[];
    positionList: {
        pageIndex: number;
        rowIndex: number;
        rect: {
            leftTop: [number, number];
            leftBottom: [number, number];
            rightTop: [number, number];
            rightBottom: [number, number];
        };
        info: {
            width: number;
            height: number;
        };
        size?: number;
        value?: string;
    }[];
    mousemoveEvent: MouseEvent | null;
    cursorTimer: number | null;
    cursorEl: HTMLDivElement | null;
    textareaEl: HTMLTextAreaElement | null;
    history: HistoryTracker<Element[]>;
    isMousedown: boolean;
    isCompositing: boolean;
    mousemoveTimer: number | null;
    listeners: {
        mousedown: null | ((positionIndex: number) => void);
        rangeChange: null | ((range: number[]) => void);
    };

    constructor(container: HTMLElement, data: Element[], options = {}) {
        this.container = container; // container which contains the created canvas pages
        this.data = data; // data to be rendered on the page

        // Preserve the history of the data so we can undo/redo
        this.history = new HistoryTracker();

        this.options = Object.assign(
            {
                pageWidth: 816, // Paper width
                pageHeight: 1056, // Paper height

                fontSize: 12, // Font size
                fontFamily: "Arial", // Font family
                color: "#000000", // Text color

                lineHeight: 1.5, // Line height, as a multiple

                pagePadding: [100, 120, 100, 120], // Paper padding, in the order: Top, Right, Bottom, Left
                pageMargin: 20, // Margin between pages

                pagePaddingIndicatorSize: 35, // Size of the padding indicator on the paper, i.e., the length of the four right angles
                pagePaddingIndicatorColor: "#AAA", // Color of the padding indicator on the paper, i.e., the color of the four right angles

                rangeColor: "#bbd3fc", // Selection area color
                rangeOpacity: 0.6, // Selection area opacity

                dpr: window.devicePixelRatio,
                zoom: 1,
            },
            options
        );

        this.observers = {};
        this.pageCanvasList = [];
        this.pageCanvasCtxList = [];
        this.rows = [];
        this.positionList = []; // rendered element position
        this.cursorPositionIndex = -1;
        this.mousemoveEvent = null;
        this.cursorEl = null; // Cursor pointer element
        this.cursorTimer = null; // blink cursor timer
        this.textareaEl = null;
        this.isCompositing = false; // whether is pinyin
        this.isMousedown = false;
        this.selectedRange = [];
        this.mousemoveTimer = null;
        this.listeners = {
            mousedown: null,
            rangeChange: null,
        };

        this.attachEvents();
        this.attachHistoryObserver();
    }

    attachHistoryObserver() {
        this.history.add(deepClone(this.data));

        const pushHistoryEvent = (context: BoardCanvas) => {
            console.log(context.data);
            this.history.add(deepClone(context.data));
        };

        for (const event of [
            "update",
            "input",
            "paste",
            "delete",
        ] as EventType[]) {
            this.observe(event, pushHistoryEvent);
        }
    }

    attachEvents() {
        document.body.addEventListener(
            "mousemove",
            this.onMousemove.bind(this)
        );

        document.body.addEventListener("mouseup", this.onMouseup.bind(this));
        document.body.addEventListener("dblclick", () => {
            this.onDbClick.bind(this);
        });
        document.body.addEventListener("keydown", (e: KeyboardEvent) => {
            // For MacOS
            const isCommandPressed = e.metaKey;

            // For Windows/Linux
            const isControlPressed = e.ctrlKey;

            const isZPressed = e.key === "z" || e.key === "Z";

            if ((isCommandPressed || isControlPressed) && isZPressed) {
                e.preventDefault();
                this.undo();
                return;
            }

            if (e.key === "ArrowLeft") {
                e.preventDefault();
                this.moveCursor("left");
                return;
            }

            if (e.key === "ArrowRight") {
                e.preventDefault();
                this.moveCursor("right");
                return;
            }
        });

        document.body.addEventListener("copy", (event) => {
            if (this.selectedRange.length === 0) {
                return;
            }
            event.preventDefault();
            const range = this.getSelectedRange();
            const text = this.data
                .slice(range[0], range[1] + 1)
                .map((item) => item.value)
                .join("");
            event.clipboardData?.setData("text/plain", text);
        });

        document.body.addEventListener("paste", (event) => {
            event.preventDefault();
            const text = event.clipboardData?.getData("text/plain");
            if (!text) {
                return;
            }
            const range = this.getSelectedRange();
            if (range.length > 0) {
                this.delete();
            }
            const cur = this.positionList[this.cursorPositionIndex];
            //Todo: support paste rich text like bold, italic, underline, images
            this.data.splice(
                this.cursorPositionIndex + 1,
                0,
                ...text.split("").map((item) => {
                    return {
                        ...(cur || {}),
                        value: item,
                        type: "text" as ElementType,
                    };
                })
            );
            this.render();
            this.cursorPositionIndex += text.length;
            this.computeAndRenderCursor(
                this.cursorPositionIndex,
                this.positionList[this.cursorPositionIndex].pageIndex
            );
            this.notify("paste", this);
        });
    }

    moveCursor(direction: "left" | "right") {
        if (direction === "left") {
            if (this.cursorPositionIndex > 0) {
                this.cursorPositionIndex--;
                const position = this.positionList[this.cursorPositionIndex];
                this.computeAndRenderCursor(
                    this.cursorPositionIndex,
                    position ? position.pageIndex : 0
                );
            }
        } else {
            if (this.cursorPositionIndex < this.positionList.length - 1) {
                this.cursorPositionIndex++;
                const position = this.positionList[this.cursorPositionIndex];
                this.computeAndRenderCursor(
                    this.cursorPositionIndex,
                    position ? position.pageIndex : 0
                );
            }
        }
    }

    undo() {
        this.data = this.history.undo();
        this.render();
    }

    redo() {
        this.data = this.history.redo();
        this.render();
    }

    //TODO: dbClick will select the whole word
    onDbClick() {
        return;
    }

    setContainer(container: HTMLElement) {
        this.container = container;
    }

    render(notComputeRows = false) {
        this.clear();
        this.positionList = [];
        if (!notComputeRows) {
            this.rows = [];
            this.computeRows();
        }
        this.renderPage();
        this.notify("render", this);
    }

    // Delete all the canvas element from dom
    removeAll() {
        this.pageCanvasList.forEach((item) => {
            item.remove();
        });
        this.pageCanvasList = [];
        this.pageCanvasCtxList = [];
    }

    //Clear the page
    clear() {
        const { pageWidth, pageHeight } = this.options;
        this.pageCanvasCtxList.forEach((item) => {
            item.clearRect(0, 0, pageWidth, pageHeight);
        });
    }

    renderPage() {
        const { pageHeight, pagePadding } = this.options;
        // Available height of the page content
        const contentHeight = pageHeight - pagePadding[0] - pagePadding[2];
        // Paint from the first page
        let pageIndex = 0;
        let ctx = this.pageCanvasCtxList[pageIndex];
        // Curren render height on the page
        let renderHeight = 0;
        this.renderPagePaddingIndicators(pageIndex);

        this.rows.forEach((row, index) => {
            if (renderHeight + row.height > contentHeight) {
                // If the height drawn in the current line exceeds the available height of the page content,
                // then turn to the next page.
                pageIndex++;
                // create the new page first
                const page = this.pageCanvasList[pageIndex];
                if (!page) {
                    this.createPage(pageIndex);
                }
                this.renderPagePaddingIndicators(pageIndex);
                ctx = this.pageCanvasCtxList[pageIndex];
                renderHeight = 0;
            }
            // render current row
            this.renderRow(ctx, renderHeight, row, pageIndex, index);

            renderHeight += row.height;
        });
    }

    async getImgBlobs() {
        const imgBlobs = this.pageCanvasList.map((canvas) => {
            return canvasToBlob(canvas).then((blob) => ({
                src: URL.createObjectURL(blob as Blob),
                id: canvas.id,
            }));
        });
        return Promise.all(imgBlobs);
    }

    renderRow(
        ctx: CanvasRenderingContext2D,
        renderHeight: number,
        row: Row,
        pageIndex: number,
        rowIndex: number
    ) {
        const { color, pagePadding, rangeColor, rangeOpacity } = this.options;

        const offsetX = pagePadding[3];
        const offsetY = pagePadding[0];

        let renderWidth = offsetX;
        renderHeight += offsetY;
        row.elementList.forEach((item) => {
            this.positionList.push({
                ...item,
                pageIndex, // element's current page
                rowIndex, // element's current row
                rect: {
                    leftTop: [renderWidth, renderHeight],
                    leftBottom: [renderWidth, renderHeight + row.height],
                    rightTop: [renderWidth + item.info.width, renderHeight],
                    rightBottom: [
                        renderWidth + item.info.width,
                        renderHeight + row.height,
                    ],
                },
            });

            if (item.value === "\n") {
                return;
            }

            ctx.save();

            // rending context

            if (item.background) {
                ctx.save();
                ctx.beginPath();
                ctx.fillStyle = item.background;
                ctx.fillRect(
                    renderWidth,
                    renderHeight,
                    item.info.width + 1, // add 1px to avoid the gap between two adjacent elements
                    row.height
                );
                ctx.restore();
            }

            if (item.underline) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(renderWidth, renderHeight + row.height);
                ctx.lineTo(
                    renderWidth + item.info.width,
                    renderHeight + row.height
                );
                ctx.stroke();
                ctx.restore();
            }

            if (item.lineThrough) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(renderWidth, renderHeight + row.height / 2);
                ctx.lineTo(
                    renderWidth + item.info.width,
                    renderHeight + row.height / 2
                );
                ctx.stroke();
                ctx.restore();
            }

            if (
                this.selectedRange.length === 2 &&
                this.selectedRange[0] !== this.selectedRange[1]
            ) {
                const range = this.getSelectedRange();
                const positionIndex = this.positionList.length - 1;
                if (positionIndex >= range[0] && positionIndex <= range[1]) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.globalAlpha = rangeOpacity;
                    ctx.fillStyle = rangeColor;
                    ctx.fillRect(
                        renderWidth,
                        renderHeight,
                        item.info.width,
                        row.height
                    );
                    ctx.restore();
                }
            }

            // Render text
            ctx.font = item.font!;
            ctx.fillStyle = item.color || color;
            ctx.fillText(
                item.value,
                renderWidth,
                renderHeight +
                    row.height -
                    (row.height - row.originHeight) / 2 -
                    row.descent
            );

            // Update the width of finished rendering on the current line
            renderWidth += item.info.width;
            ctx.restore();
        });

        // Render Base line
        // ctx.beginPath();
        // ctx.moveTo(pagePadding[3], renderHeight + row.height);
        // ctx.lineTo(673, renderHeight + row.height);
        // ctx.stroke();
    }

    getSelectedRange() {
        if (this.selectedRange.length < 2) {
            return [];
        }
        if (this.selectedRange[1] > this.selectedRange[0]) {
            return [this.selectedRange[0] + 1, this.selectedRange[1]];
        } else if (this.selectedRange[1] < this.selectedRange[0]) {
            return [this.selectedRange[1] + 1, this.selectedRange[0]];
        } else {
            return [];
        }
    }

    clearSelectedRange() {
        if (this.selectedRange.length > 0) {
            this.selectedRange = [];
            this.render();
        }
    }

    computeRows() {
        const { pageWidth, pagePadding, lineHeight, fontSize } = this.options;
        // Get the actual width of the content
        const contentWidth = pageWidth - pagePadding[1] - pagePadding[3];
        // create a temperate canvas to calculate the size of painted text
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        const rows: Row[] = [];
        rows.push({
            type: "text",
            width: 0,
            height: 0,
            originHeight: 0, // height of the text without line height
            descent: 0, // maximum descent within the row
            elementList: [],
        });
        this.data.forEach((item) => {
            const { value, type } = item;

            let { lineHeight: actLineHeight } = item;
            actLineHeight = actLineHeight || lineHeight;

            // get the pained style of the text like "italic bold 12px Arial"
            const font = this.getFontStr(item);

            const info = {
                width: 0,
                height: 0,
                ascent: 0,
                descent: 0,
            };
            if (value === "\n") {
                // the new line character has a width of 0 and a height of the font size
                info.height = fontSize;
            } else {
                ctx.font = font;
                const {
                    width,
                    actualBoundingBoxAscent,
                    actualBoundingBoxDescent,
                } = ctx.measureText(value);
                // calculate the actual painted width and height of the text
                info.width = width;
                info.height =
                    actualBoundingBoxAscent + actualBoundingBoxDescent;
                info.ascent = actualBoundingBoxAscent;
                info.descent = actualBoundingBoxDescent;
            }

            const element = {
                ...item,
                info,
                font,
            };

            const curRow = rows[rows.length - 1];
            // Check whether current line has free space to contain the text

            // can fit
            if (curRow.width + info.width <= contentWidth && value !== "\n") {
                curRow.elementList.push(element);
                curRow.width += info.width;

                // Save the largest value for each line
                curRow.height = Math.max(
                    curRow.height,
                    info.height * actLineHeight
                ); // Save the hightest height of the char in the line
                curRow.originHeight = Math.max(
                    curRow.originHeight,
                    info.height
                );
                curRow.descent = Math.max(curRow.descent, info.descent);
            } else {
                rows.push({
                    type,
                    width: info.width,
                    height: info.height * actLineHeight,
                    originHeight: info.height,
                    elementList: [element],
                    descent: info.descent,
                });
            }
        });
        this.rows = rows;
    }

    // get font style on canvas
    getFontStr(element: Element) {
        const { fontSize, fontFamily } = this.options;
        return `${element.italic ? "italic " : ""} ${
            element.bold ? "bold " : ""
        } ${element.size || fontSize}px  ${element.fontfamily || fontFamily} `;
    }

    // Create new page
    createPage(pageIndex: number) {
        const { pageWidth, pageHeight, pageMargin, dpr, zoom } = this.options;
        const canvas = document.createElement("canvas");
        canvas.id = `page-${pageIndex}`;
        canvas.width = pageWidth * dpr * zoom;
        canvas.height = pageHeight * dpr * zoom;
        canvas.style.width = pageWidth * zoom + "px";
        canvas.style.height = pageHeight * zoom + "px";
        canvas.style.cursor = "text";
        canvas.style.backgroundColor = "#fff";
        canvas.style.boxShadow = "#9ea1a566 0 2px 12px";
        canvas.style.marginBottom = pageMargin + "px";
        canvas.addEventListener("mousedown", (e) => {
            this.onMousedown(e, pageIndex);
        });
        this.container.appendChild(canvas);
        const ctx = canvas.getContext("2d")!;
        ctx.scale(dpr * zoom, dpr * zoom);
        this.pageCanvasList.push(canvas);
        this.pageCanvasCtxList.push(ctx);
    }

    onMousedown(e: MouseEvent, pageIndex: number) {
        this.isMousedown = true;

        const { x, y } = this.windowToCanvas(e, this.pageCanvasList[pageIndex]);
        const positionIndex = this.getPositionByPos(x, y, pageIndex);
        this.cursorPositionIndex = positionIndex;
        this.computeAndRenderCursor(positionIndex, pageIndex);
        this.selectedRange[0] = positionIndex;
        if (this.listeners.mousedown) {
            this.listeners.mousedown(positionIndex);
        }
    }

    onMousemove(e: MouseEvent) {
        this.mousemoveEvent = e;
        if (this.mousemoveTimer) {
            return;
        }
        this.mousemoveTimer = window.setTimeout(() => {
            this.mousemoveTimer = null;
            if (!this.isMousedown) {
                return;
            }
            e = this.mousemoveEvent!;

            const pageIndex = this.getPosInPageIndex(e.clientX, e.clientY);
            if (pageIndex === -1) {
                return;
            }

            const { x, y } = this.windowToCanvas(
                e,
                this.pageCanvasList[pageIndex]
            );

            const positionIndex = this.getPositionByPos(x, y, pageIndex);
            if (positionIndex !== -1) {
                this.selectedRange[1] = positionIndex;
                if (this.listeners.rangeChange) {
                    this.listeners.rangeChange(this.getSelectedRange());
                }
                if (
                    Math.abs(this.selectedRange[1] - this.selectedRange[0]) > 0
                ) {
                    this.cursorPositionIndex = -1;
                    this.hideCursor();
                }
                this.render(true);
            }
        }, 100);
    }

    onMouseup() {
        this.isMousedown = false;
    }

    // get the element on the clicked position
    // pageIndex: the index of the page
    getPositionByPos(x: number, y: number, pageIndex: number) {
        for (let i = 0; i < this.positionList.length; i++) {
            const cur = this.positionList[i];
            if (cur.pageIndex !== pageIndex) {
                continue;
            }
            if (
                x >= cur.rect.leftTop[0] &&
                x <= cur.rect.rightTop[0] &&
                y >= cur.rect.leftTop[1] &&
                y <= cur.rect.leftBottom[1]
            ) {
                if (x < cur.rect.leftTop[0] + cur.info.width / 2) {
                    return i - 1;
                }
                return i;
            }
        }

        // if not found check whether the clicked position is in a row
        let index = -1;
        for (let i = 0; i < this.positionList.length; i++) {
            const cur = this.positionList[i];
            if (cur.pageIndex !== pageIndex) {
                continue;
            }
            if (y >= cur.rect.leftTop[1] && y <= cur.rect.leftBottom[1]) {
                index = i;
            }
        }
        if (index !== -1) {
            return index;
        }

        // Return the last element on that page
        for (let i = 0; i < this.positionList.length; i++) {
            const cur = this.positionList[i];
            if (cur.pageIndex !== pageIndex) {
                continue;
            }
            index = i;
        }
        return index;
    }

    getCursorInfo(positionIndex: number): {
        x: number;
        y: number;
        height: number;
    } {
        const position = this.positionList[positionIndex];
        const { fontSize, pagePadding, lineHeight } = this.options;
        const height = (position ? position.size : null) || fontSize;
        const plusHeight = height / 2;
        const actHeight = height + plusHeight;

        if (!position) {
            const next = this.positionList[positionIndex + 1];
            if (next) {
                const nextCursorInfo = this.getCursorInfo(positionIndex + 1);
                return {
                    x: pagePadding[3],
                    y: nextCursorInfo.y,
                    height: nextCursorInfo.height,
                };
            } else {
                return {
                    x: pagePadding[3],
                    y: pagePadding[0] + (height * lineHeight - actHeight) / 2,
                    height: actHeight,
                };
            }
        }

        const isNewlineCharacter = position.value === "\n";
        const row = this.rows[position.rowIndex];

        return {
            x: isNewlineCharacter
                ? position.rect.leftTop[0]
                : position.rect.rightTop[0],
            y:
                position.rect.rightTop[1] +
                row.height -
                (row.height - row.originHeight) / 2 -
                actHeight +
                (actHeight - Math.max(height, position.info.height)) / 2,
            height: actHeight,
        };
    }

    // Compute cursor position in the page
    computeAndRenderCursor(positionIndex: number, pageIndex: number) {
        const cursorInfo = this.getCursorInfo(positionIndex);

        const cursorPos = this.canvasToContainer(
            cursorInfo.x,
            cursorInfo.y,
            this.pageCanvasList[pageIndex]
        );
        this.setCursor(cursorPos.x, cursorPos.y, cursorInfo.height);
    }

    setCursor(left: number, top: number, height: number) {
        this.clearSelectedRange();
        this.cursorTimer && clearTimeout(this.cursorTimer);
        if (!this.cursorEl) {
            this.cursorEl = document.createElement("div");
            this.cursorEl.style.position = "absolute";
            this.cursorEl.style.width = "1px";
            this.cursorEl.style.backgroundColor = "#000";
            this.container.appendChild(this.cursorEl);
        }
        this.cursorEl.style.left = left + "px";
        this.cursorEl.style.top = top + "px";
        this.cursorEl.style.height = height + "px";
        this.cursorEl.style.opacity = "1";
        setTimeout(() => {
            this.focus();
            if (this.cursorEl) this.cursorEl.style.display = "block";
            this.blinkCursor("0");
        }, 0);
        this.notify("pointerdown", this);
    }

    hideCursor() {
        this.cursorTimer && clearTimeout(this.cursorTimer);
        if (this.cursorEl) this.cursorEl.style.display = "none";
    }

    blinkCursor(opacity: string) {
        this.cursorTimer = window.setTimeout(() => {
            if (this.cursorEl) {
                this.cursorEl.style.opacity = opacity;
            }
            this.blinkCursor(opacity === "0" ? "1" : "0");
        }, 600);
    }

    focus() {
        if (!this.textareaEl) {
            this.textareaEl = document.createElement("textarea");
            this.textareaEl.style.position = "absolute";
            this.textareaEl.style.opacity = "0";
            this.textareaEl.style.pointerEvents = "none";
            this.textareaEl.style.width = "0";
            this.textareaEl.style.height = "0";
            this.textareaEl.style.overflow = "hidden";
            this.textareaEl.addEventListener("input", this.onInput.bind(this));
            this.textareaEl.addEventListener("compositionstart", () => {
                this.isCompositing = true;
            });
            this.textareaEl.addEventListener("compositionend", () => {
                this.isCompositing = false;
            });
            this.textareaEl.addEventListener(
                "keydown",
                this.onKeydown.bind(this)
            );
            this.textareaEl.addEventListener("blur", () => {
                this.hideCursor();
            });
            // Add to the same container as the pointer cursor
            this.container.appendChild(this.textareaEl);
        }

        this.textareaEl.value = "";
        // when focus, set the textarea position to the cursor position
        this.textareaEl.style.left = this.cursorEl!.style.left;
        this.textareaEl.style.top = this.cursorEl!.style.top;
        this.textareaEl.focus();
    }

    onInput(e: Event) {
        setTimeout(() => {
            const data = (e as InputEvent).data;
            if (!data || this.isCompositing) {
                return;
            }

            const arr = data.split("");
            const length = arr.length;
            const range = this.getSelectedRange();
            if (range.length > 0) {
                this.delete();
            }
            const cur = this.positionList[this.cursorPositionIndex];
            this.data.splice(
                this.cursorPositionIndex + 1,
                0,
                ...arr.map((item) => {
                    return {
                        ...(cur || {}),
                        value: item,
                        type: "text" as ElementType,
                    };
                })
            );
            this.render();
            this.cursorPositionIndex += length;
            this.computeAndRenderCursor(
                this.cursorPositionIndex,
                this.positionList[this.cursorPositionIndex].pageIndex
            );
            this.notify("input", this);
        }, 0);
    }

    onKeydown(e: KeyboardEvent) {
        if (e.code === "Backspace") {
            this.delete();
        } else if (e.code === "Enter") {
            this.newLine();
        }
    }

    // Delete content
    delete() {
        if (this.cursorPositionIndex < 0) {
            const range = this.getSelectedRange();
            if (range.length > 0) {
                const length = range[1] - range[0] + 1;
                this.data.splice(range[0], length);
                this.cursorPositionIndex = range[0] - 1;
            } else {
                return;
            }
        } else {
            this.data.splice(this.cursorPositionIndex, 1);
            this.render();
            this.cursorPositionIndex--;
        }
        const position = this.positionList[this.cursorPositionIndex];
        this.computeAndRenderCursor(
            this.cursorPositionIndex,
            position ? position.pageIndex : 0
        );
        this.notify("delete", this);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateSelectedText(attrName: ElementAttribute, attrValue?: any) {
        if (this.cursorPositionIndex < 0) {
            const range = this.getSelectedRange();
            if (range.length > 0) {
                for (let i = range[0]; i <= range[1]; i++) {
                    const item = this.data[i];
                    switch (attrName) {
                        case "increaseFontSize": {
                            if (item.size) {
                                item.size += 1;
                            } else {
                                item.size = this.options.fontSize + 1;
                            }
                            break;
                        }
                        case "decreaseFontSize": {
                            if (item.size) {
                                item.size -= 1;
                            } else {
                                item.size = this.options.fontSize - 1;
                            }
                            break;
                        }
                        case "bold":
                        case "italic":
                        case "underline":
                        case "lineThrough": {
                            item[attrName] = !item[attrName];
                            break;
                        }
                        case "color":
                        case "background": {
                            item[attrName] = attrValue as string;
                            break;
                        }
                    }
                }
            } else {
                return;
            }
        }
        this.render();
        this.notify("update", this);
    }

    newLine() {
        this.data.splice(this.cursorPositionIndex + 1, 0, {
            value: "\n",
            type: "text" as ElementType,
        });
        this.render();
        this.cursorPositionIndex++;
        const position = this.positionList[this.cursorPositionIndex];
        this.computeAndRenderCursor(
            this.cursorPositionIndex,
            position.pageIndex
        );
    }

    // Calculate the position belong to which page
    getPosInPageIndex(x: number, y: number) {
        const { left, top, right, bottom } =
            this.container.getBoundingClientRect();

        if (x < left || x > right || y < top || y > bottom) {
            return -1;
        }
        const { pageHeight, pageMargin } = this.options;
        const scrollTop = this.container.scrollTop;

        const totalTop = y - top + scrollTop;
        for (let i = 0; i < this.pageCanvasList.length; i++) {
            const pageStartTop = i * (pageHeight + pageMargin);
            const pageEndTop = pageStartTop + pageHeight;
            if (totalTop >= pageStartTop && totalTop <= pageEndTop) {
                return i;
            }
        }
        return -1;
    }

    windowToCanvas(e: MouseEvent, canvas: HTMLCanvasElement) {
        const { left, top } = canvas.getBoundingClientRect();
        return {
            x: e.clientX - left,
            y: e.clientY - top,
        };
    }

    canvasToContainer(x: number, y: number, canvas: HTMLCanvasElement) {
        return {
            x: x + canvas.offsetLeft,
            y: y + canvas.offsetTop,
        };
    }

    // TODO: allow pass eventList string like 'hover|click'
    observe(type: EventType, callback: (context: BoardCanvas) => void) {
        if (!this.observers[type]) {
            this.observers[type] = [];
        }
        this.observers[type]?.push(callback);
    }

    unObserve(type: EventType, callback: (context: BoardCanvas) => void) {
        if (this.observers[type]) {
            this.observers[type] = this.observers[type]?.filter(
                (c) => c !== callback
            );
        }
    }

    notify(type: EventType, data: BoardCanvas) {
        this.observers[type]?.forEach((item) => {
            item.call(this, data);
        });
    }

    // Paint page padding indicators
    renderPagePaddingIndicators(pageNo: number) {
        const ctx = this.pageCanvasCtxList[pageNo];
        if (!ctx) {
            return;
        }
        const {
            pageWidth,
            pageHeight,
            pagePaddingIndicatorColor,
            pagePadding,
            pagePaddingIndicatorSize,
        } = this.options;
        ctx.save();
        ctx.strokeStyle = pagePaddingIndicatorColor;
        const list = [
            // Left top
            [
                [pagePadding[3], pagePadding[0] - pagePaddingIndicatorSize],
                [pagePadding[3], pagePadding[0]],
                [pagePadding[3] - pagePaddingIndicatorSize, pagePadding[0]],
            ],
            // Right top
            [
                [
                    pageWidth - pagePadding[1],
                    pagePadding[0] - pagePaddingIndicatorSize,
                ],
                [pageWidth - pagePadding[1], pagePadding[0]],
                [
                    pageWidth - pagePadding[1] + pagePaddingIndicatorSize,
                    pagePadding[0],
                ],
            ],
            // Left right
            [
                [
                    pagePadding[3],
                    pageHeight - pagePadding[2] + pagePaddingIndicatorSize,
                ],
                [pagePadding[3], pageHeight - pagePadding[2]],
                [
                    pagePadding[3] - pagePaddingIndicatorSize,
                    pageHeight - pagePadding[2],
                ],
            ],
            // right Left
            [
                [
                    pageWidth - pagePadding[1],
                    pageHeight - pagePadding[2] + pagePaddingIndicatorSize,
                ],
                [pageWidth - pagePadding[1], pageHeight - pagePadding[2]],
                [
                    pageWidth - pagePadding[1] + pagePaddingIndicatorSize,
                    pageHeight - pagePadding[2],
                ],
            ],
        ];
        list.forEach((item) => {
            item.forEach((point, index) => {
                const [x, y] = point;
                if (index === 0) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
                if (index >= item.length - 1) {
                    ctx.stroke();
                }
            });
        });
        ctx.restore();
    }
}
