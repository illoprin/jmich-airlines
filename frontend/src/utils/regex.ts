export const generalLatinRegex = /^[\w_$\-&]+$/;
export const emailRegex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
export const oneUnicodeWordRegex = /^[\p{L}-]+$/u;
export const phoneRegex = /^[0-9]{10}$/;
export const cardNumberRegex = /^[0-9]{16}$/;
export const cardCVVRegex = /^[0-9]{3}$/;
export const cardExpiresRegex = /^[0-9]{4}$/;