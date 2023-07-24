import type { Element, EventType } from "shared/Types";

import { BoardCanvas } from "editor-core";
import { debouncedSaveToLocalStorage } from "shared/utils";

const text = `What is Lorem Ipsum?\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n Where does it come from? \n Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham. \nWhy do we use it?\n It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham. \nWhy do we use it?\n It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. `;

const initialData = text.split("").map((item, index) => {
    if (index >= 2 && index <= 7) {
        return {
            type: "text",
            value: item,
            color: "#ef4444",
            size: 30,
        };
    } else if (index === 38) {
        return {
            type: "text",
            value: item,
            background: "#409EFF",
        };
    } else if (index >= 60 && index <= 90) {
        return {
            type: "text",
            value: item,
            bold: true,
            fontfamily: "Fantasy",
        };
    } else if (index >= 200 && index <= 280) {
        return {
            type: "text",
            value: item,
            italic: true,
            lineheight: 3,
            background: "#E6A23C",
        };
    } else if (index >= 500 && index <= 530) {
        return {
            type: "text",
            value: item,
            underline: true,
        };
    } else if (index >= 800 && index <= 900) {
        return {
            type: "text",
            value: item,
            linethrough: true,
            color: "#8b5cf6",
        };
    } else if (index >= 304 && index <= 350) {
        return {
            type: "text",
            value: item,
            color: "rgb(246, 96, 0)",
            size: 20,
            fontfamily: "cursive",
        };
    } else if (index >= 1000 && index <= 1230) {
        return {
            type: "text",
            value: item,
            color: "#ec4899",
            size: 24,
        };
    } else if (index >= 1600 && index <= 1888) {
        return {
            type: "text",
            value: item,
            size: 18,
            fontfamily: "Monospace",
            background: "#10b981",
        };
    } else {
        return {
            type: "text",
            value: item,
        };
    }
});

const jsonString = localStorage.getItem("data");
const data = (
    jsonString === null ? initialData : JSON.parse(jsonString)
) as Element[];

export const editor = new BoardCanvas(document.createElement("div"), data, {});

const debouncedSaveToLocalStorageInstance = debouncedSaveToLocalStorage(800);

for (const event of ["update", "input", "paste", "delete"] as EventType[]) {
    editor.observe(event, (context: BoardCanvas) => {
        debouncedSaveToLocalStorageInstance(
            "data",
            JSON.stringify(context.data)
        );
    });
}

editor.observe("pointerdown", (context: BoardCanvas) => {
    console.log("pointerdown", context.cursorEl, context.cursorPositionIndex);
});
