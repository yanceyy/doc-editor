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
