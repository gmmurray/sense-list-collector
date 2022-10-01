import { SortDir } from '../types/sort';

const getSortValues = (dir: SortDir) => {
  let affirmative = 1;
  let negative = 1;
  if (dir === 'desc') {
    affirmative = -1;
  } else {
    negative = -1;
  }

  return {
    affirmative,
    negative,
  };
};

export function sortByCreatedAt<T extends { createdAt: Date }>(
  elements: T[],
  dir: SortDir,
) {
  const { affirmative, negative } = getSortValues(dir);
  return [...elements].sort((a, b) =>
    a.createdAt > b.createdAt ? affirmative : negative,
  );
}

export function sortByUpdatedAt<T extends { updatedAt: Date }>(
  elements: T[],
  dir: SortDir,
) {
  const { affirmative, negative } = getSortValues(dir);
  return [...elements].sort((a, b) =>
    a.updatedAt > b.updatedAt ? affirmative : negative,
  );
}

export function sortByTimestamp<T extends { updatedAt: Date; createdAt: Date }>(
  elements: T[],
  timestamp: 'created' | 'updated',
  dir: SortDir,
) {
  return timestamp === 'created'
    ? sortByCreatedAt(elements, dir)
    : sortByUpdatedAt(elements, dir);
}
