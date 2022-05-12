export const DAY_IN_MILLISEC = 86400000;
export const parseToken = (token) => token.replace(/\s+/g, '-');
export const normalize = (str) => str.toLowerCase().replace(/[^\w\s]|_/g, '');
