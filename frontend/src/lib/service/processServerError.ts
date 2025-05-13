function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
export function processAPIError(err: any): Error {
  const serverMsg = capitalizeFirstLetter((err as Error).message);
  const message = `Ошибка на стороне сервера: ${serverMsg}`;
  return new Error(message);
}
