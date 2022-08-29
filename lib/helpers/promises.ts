export function mockPromisify<T>(result: T, timeout: number = 500): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(result), timeout));
}
