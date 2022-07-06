export function readStore(key: string): Promise<any> {
    return new Promise((resolve) => {
        try {
            const data = localStorage.getItem(key);
            resolve(data ? JSON.parse(data) : undefined);
        } catch (err) { console.error(err); resolve(undefined); }
    });
}

export function writeStore(key: string, value: any): Promise<void> {
    return new Promise((resolve) => {
        try {
            if (value) localStorage.setItem(key, JSON.stringify(value))
            else localStorage.removeItem(key);
        } catch (err) { console.error(err); }
        resolve();
    });
}

export function emptyStore(key: string): Promise<void> {
    return new Promise((resolve) => {
        try {
            localStorage.removeItem(key);
        } catch { }
        resolve();
    });
}
