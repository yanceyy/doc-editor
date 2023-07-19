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
