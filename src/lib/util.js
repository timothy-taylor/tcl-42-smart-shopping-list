export const DAY_IN_MILLISEC = 86400000;
export const parseToken = (token) => token.replace(/\s+/g, '-');
export const normalize = (str) => str.toLowerCase().replace(/[^\w\s]|_/g, '');
export const buttonStyles =
  'w-full p-2 rounded-md border-2 border-secondary font-bold text-secondary hover:text-white hover:bg-secondary';
