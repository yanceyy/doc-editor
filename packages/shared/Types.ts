export interface DocEditorConfigOptions {
    pageWidth: number; // Paper width
    pageHeight: number; // Paper height
    orientation: "portrait" | "landscape"; // Paper orientation
    pagePadding: number[]; // Paper padding, respectively: top, right, bottom, left
    pageMargin: number; // Margin between pages
    pagePaddingIndicatorSize: number; // Size of the paper padding indicator, which is the side length of the four right angles
    pagePaddingIndicatorColor: string; // Color of the paper padding indicator, which is the color of the four right angles
    color: string; // Text color
    fontSize: number; // Font size
    fontFamily: string; // Font family
    lineHeight: number; // Line height, in multiples
    rangeOpacity: number; // Selection opacity
    rangeColor: string; // Selection color
    dpr: number; // Device pixel ratio
    zoom: number; // Zoom ratio
}

export type EventType =
    | "update"
    | "delete"
    | "input"
    | "mousedown"
    | "rangeChange"
    | "render"
    | "pointerdown"
    | "paste"
    | "moveCursor"
    | "placeCursor"
    | "contextmenu";

export type ElementType = "text" | "image" | "list";

export interface Row {
    type: ElementType;
    width: number;
    height: number;
    originHeight: number;
    descent: number;
    elementList: ComputedElement[];
}

export type Element = {
    type: ElementType; // Element type
    value: string; // Text content
    size?: number; // Font size
    fontfamily?: string; // Font family
    font?: string; // Combined font family and size
    bold?: boolean; // Bold text
    italic?: boolean; // Italic text
    underline?: boolean; // Underlined text
    lineThrough?: boolean; // Strikethrough text
    background?: string; // Background color
    color?: string; // Text color
    lineHeight?: number; // Line height multiplier
};

export interface ComputedElement extends Element {
    info: {
        width: number;
        height: number;
    };
}

export type ElementAttribute =
    | Exclude<keyof Element, "value">
    | "increaseFontSize"
    | "decreaseFontSize";

export interface Color {
    name: string;
    value: string;
}
