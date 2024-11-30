export const numberListToArray = (
  list: string | undefined,
  separator: string = ',',
): number[] =>
  (list ? (list as string).split(separator as string) : []).map((item) =>
    parseInt(item, 10),
  );
