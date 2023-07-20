import { debounce } from "./debounce";

export function debouncedSaveToLocalStorage(delay = 1000) {
    return debounce((key: string, value: string) => {
        localStorage.setItem(key, value);
    }, delay);
}
