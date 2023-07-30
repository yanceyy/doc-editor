import "./fonts/Lumanosimo-Regular-normal";
import "./fonts/EduSABeginner-normal";

import { BoardCanvas } from "editor-core";
import { jsPDF } from "jspdf";

export function pdfExport(editor: BoardCanvas) {
    const { pagePadding, pageHeight, pageWidth, orientation } = editor.options;
    const doc = new jsPDF({
        orientation, // portrait or landscape
        unit: "px", // measurement unit: pt, mm, cm, in
        format: [pageWidth, pageHeight], // format: a4, a3, a2, etc.
    });

    const { rows } = editor;
    const offsetX = pagePadding[3];
    // When it is painted on the jspdf, the top padding looks too large than it shows in canvas, so reduce it by 30%
    const offsetY = pagePadding[0] * 0.7;
    const availableHeight = pageHeight - offsetY * 2;
    let renderHeight = offsetY;
    rows.forEach((row, index) => {
        const { elementList } = row;
        let renderWidth = offsetX;
        renderHeight += index === 0 ? 0 : rows[index - 1].height;

        elementList.forEach((element) => {
            doc.setFont(
                element.fontfamily ?? "Courier",
                element.italic ? "italic" : "normal",
                element.bold ? "bold" : "normal"
            );
            doc.setFontSize(element.size ?? 16);
            doc.setTextColor(element.color ?? "#000000");
            if (element.background && element.background !== "transparent") {
                doc.setFillColor(element.background);
                doc.rect(
                    renderWidth,
                    renderHeight,
                    element.info.width + 1, // add 1px to avoid the gap between two adjacent elements
                    row.height,
                    "F"
                );
            }

            if (element.underline) {
                doc.setLineWidth(1);
                doc.line(
                    renderWidth,
                    renderHeight + row.height,
                    renderWidth + element.info.width,
                    renderHeight + row.height
                );
            }

            if (element.lineThrough) {
                doc.setLineWidth(1);
                doc.line(
                    renderWidth,
                    renderHeight + row.height / 2,
                    renderWidth + element.info.width,
                    renderHeight + row.height / 2
                );
            }

            doc.text(
                element.value,
                renderWidth,
                renderHeight +
                    row.height -
                    (row.height - row.originHeight) / 2 -
                    row.descent
            );
            renderWidth += element.info.width;
        });
        // To new Page
        if (availableHeight < renderHeight + row.height) {
            doc.addPage();
            renderHeight = offsetY;
        }
    });

    return doc.save("file.pdf", { returnPromise: true });
}
