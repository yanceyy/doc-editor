export function deepClone<T>(obj: T): T {
    if (typeof structuredClone === "function") {
        return structuredClone(obj);
    }
    return JSON.parse(JSON.stringify(obj)) as T;
}
