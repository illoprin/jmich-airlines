export const DAY_MILLISECONDS = 86400000;
export const HOUR_SECONDS = 3600;
export const HOUR_MILLISECONDS = 3600000;
export const FILE_PATH_REGEX = /^\/upload\/[a-z0-9_\-\/]+\.[a-z]{2,4}$/;
export const LOGIN_REGEX = /^[A-Za-z-_\d+]+$/;
export const DISCOUNT_REGEX = /^[0-9a-zA-Z_-]+$/;
export const SINGLE_UNICODE_WORD_REGEX = /^[\p{L}-]+$/u;
export const SOME_WORDS_SINGLE_SPACE_REGEX =
  /^[\p{L}\p{M}]+(?:[\s][\p{L}\p{M}.\-']+)*$/u;
