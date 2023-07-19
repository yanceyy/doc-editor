import { FixedSizedArray } from "./FixedSizedArray";

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
