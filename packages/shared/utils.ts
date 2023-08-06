export type DebouncedFunction<T extends (...args: any[]) => any> = ((
    ...args: Parameters<T>
) => void) & {
    cancel: () => void;
    flush: () => void;
};

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): DebouncedFunction<T> {
    let timeoutId: number | null = null;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let callBack = () => {};
    function returnedFunction(...args: Parameters<T>): void {
        if (timeoutId) clearTimeout(timeoutId);
        callBack = () => {
            func(...args);
            timeoutId = null;
        };
        timeoutId = window.setTimeout(callBack, wait);
    }

    returnedFunction.cancel = function (): void {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    returnedFunction.flush = function (): void {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
            callBack();
        }
    };
    return returnedFunction as DebouncedFunction<T>;
}

export function debouncedSaveToLocalStorage(delay = 1000) {
    return debounce((key: string, value: string) => {
        localStorage.setItem(key, value);
    }, delay);
}

export function deepClone<T>(obj: T): T {
    if (typeof structuredClone === "function") {
        return structuredClone(obj);
    }
    return JSON.parse(JSON.stringify(obj)) as T;
}

export class FixedSizedArray<T> {
    array: Array<T>;
    size: number;
    constructor(size: number) {
        this.size = size;
        this.array = new Array<T>();
    }
    push(item: T) {
        if (this.array.length === this.size) {
            this.array.shift();
        }
        this.array.push(item);
    }
    get length() {
        return this.array.length;
    }
    get(index: number) {
        return this.array[index];
    }
    removeAfter(index: number) {
        this.array.splice(index + 1);
    }
}

export class HistoryTracker<T> {
    FixedSizedArray: FixedSizedArray<T>;
    currentHistoryIndex: number;
    constructor(size = 10) {
        this.FixedSizedArray = new FixedSizedArray(size);
        this.currentHistoryIndex = -1;
    }

    add(item: T) {
        // If we are not at the end of the history, remove all the items after the current index
        if (this.currentHistoryIndex < this.FixedSizedArray.length - 1) {
            this.FixedSizedArray.removeAfter(this.currentHistoryIndex);
        }
        this.FixedSizedArray.push(item);
        this.currentHistoryIndex = this.FixedSizedArray.length - 1;
    }
    undo() {
        if (this.currentHistoryIndex > 0) {
            this.currentHistoryIndex--;
        }
        return this.FixedSizedArray.get(this.currentHistoryIndex);
    }
    redo() {
        if (this.currentHistoryIndex < this.FixedSizedArray.length - 1) {
            this.currentHistoryIndex++;
        }
        return this.FixedSizedArray.get(this.currentHistoryIndex);
    }
}

export function canvasToBlob(canvas: HTMLCanvasElement) {
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

export function isMacPlatform() {
    return navigator.userAgent.indexOf("Mac") > -1;
}

export function getCmdByPlatform() {
    if (isMacPlatform()) {
        return "cmd";
    }
    return "ctrl";
}
