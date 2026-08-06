export type FetchError = {
  code: 'cors' | 'http' | 'parse';
  message: string;
  url?: string;
};

export type Result<T, E = FetchError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export function unwrap<T, E>(r: Result<T, E>): T {
  if (r.ok) return r.value;
  throw new Error(`unwrap on Err: ${JSON.stringify(r.error)}`);
}
