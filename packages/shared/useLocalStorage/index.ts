import { useState } from "react";

// Not support SSR
export function useLocalStorage<T>(key: string) {
    // Read value from LocalStorage on first render(sync)
    const [value, setValue] = useState<T | undefined>(() => {
        const jsonValue = localStorage.getItem(key);
        if (jsonValue != null) return JSON.parse(jsonValue) as T;
    });

    const setLocalStorageValue = (newValue: T) => {
        setValue(newValue);
        localStorage.setItem(key, JSON.stringify(newValue));
    };
    return [value, setLocalStorageValue];
}
