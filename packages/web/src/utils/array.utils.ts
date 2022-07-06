export const groupBy = (xs, key) => {
    return xs.reduce((rv, x) => {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

export const sort = (xs, key) => {
    return xs.sort((a, b) => {
        if (a[key] > b[key]) return 1;
        if (a[key] < b[key]) return -1;
        return 0;
    })
}

export const sortDesc = (xs, key) => {
    return xs.sort((a, b) => {
        if (a[key] < b[key]) return 1;
        if (a[key] > b[key]) return -1;
        return 0;
    })
}

export const removeEmpty = (xs) => {
    xs = (xs && Array.isArray(xs)) ? xs : [];
    return xs.filter(item => item && item !== null && item.toString().trim() !== '')
}

export const removeDuplicates = (xs) => {
    xs = (xs && Array.isArray(xs)) ? xs : [];
    return xs.filter((item, pos) => xs.indexOf(item) == pos);
}

export const arraysEquals = (a1: any[], a2: any[]): boolean =>
    !!(a1.length === a2.length && a1.every((o, idx) => objectsEquals(o, a2[idx])));

export const objectsEquals = (o1: any, o2: any): boolean =>
    !!(Object.keys(o1).length === Object.keys(o2).length
        && Object.keys(o1).every(p => o1[p] === o2[p]));