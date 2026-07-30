export type DataResult<T> =
  | { kind: "success"; data: T }
  | { kind: "empty" }
  | { kind: "not-found" }
  | { kind: "error"; error: { code: string; message: string; status?: number } };
