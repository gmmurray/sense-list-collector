export function sanitizeInputs<T>(values: T) {
  let result: Record<string, any> = {};

  Object.keys(values).forEach((key) => {
    const value = values[key as keyof T];
    if (value !== undefined) {
      result[key] = value;
    }
  });

  return { ...result };
}
