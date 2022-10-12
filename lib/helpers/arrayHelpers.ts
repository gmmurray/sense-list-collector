function onlyUnique<T>(value: T, index: number, self: T[]) {
  return self.indexOf(value) === index;
}

export function uniqueElements<T>(
  elements: T[],
  includeUndefined: boolean = false,
): T[] {
  const result = elements.filter(onlyUnique);

  return includeUndefined ? result : result.filter(r => !!r);
}
