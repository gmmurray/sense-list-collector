export const getStringFromStringOrArray = (input: string | string[] = '') =>
  typeof input === 'string' ? input : input[0];
