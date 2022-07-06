

export const capitalizeFirstLetter = ([first, ...rest]: string): string =>
    first ? first.toUpperCase().trim() + rest.join('').toLowerCase().trim() : first + rest

export const capitalizeName = (name: string): string =>
    name.split(' ').map(namePart => capitalizeFirstLetter(namePart)).join(' ')
