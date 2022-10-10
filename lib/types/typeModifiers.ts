export type RequiredProps<T> = {
  [Property in keyof T]-?: T[Property];
};
