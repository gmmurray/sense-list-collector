export const getStringFromStringOrArray = (input: string | string[] = '') =>
  typeof input === 'string' ? input : input[0];

export const stringHasValue = (input?: string) => !!input?.length;
