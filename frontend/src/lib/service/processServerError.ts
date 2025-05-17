import { capitalizeFirstLetter } from "@/lib/string/switchCaseFirstChar";

export function processAPIError(err: any): Error {
  const serverMsg = capitalizeFirstLetter((err as Error).message);
  const message = `Ошибка на стороне сервера: ${serverMsg}`;
  return new Error(message);
}
