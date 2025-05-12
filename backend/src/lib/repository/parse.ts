/**
 * This function processes raw json array from sql output
 * @param rows - raw sql output like this [{fieldName: jsonString}, ...]
 * @param fieldName - name of first field of object on json array
 * @param callback - function calling for each json object
 * @returns structured dto
 */
export function parseJSONArray<T>(
  rows: any[],
  fieldName: string,
  callback: (dto: any) => T = (dto) => dto,
): T[] {
  const dtos: T[] = [];
  for (const row of rows) {
    const raw = JSON.parse(row[fieldName]);
    const dto = callback(raw) as T;
    dtos.push(dto);
  }
  return dtos;
}
