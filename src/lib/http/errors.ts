import { getMessage } from "./response";

export class UpstreamError extends Error {
  readonly status: number;
  readonly code: string;
  readonly payload: unknown;

  constructor(status: number, payload: unknown, fallback = "The service is temporarily unavailable.") {
    super(getMessage(payload, fallback));
    this.name = "UpstreamError";
    this.status = status;
    this.code = status === 401 ? "UNAUTHORIZED" : status === 404 ? "NOT_FOUND" : "UPSTREAM_ERROR";
    this.payload = payload;
  }
}

export function isUpstreamError(error: unknown): error is UpstreamError {
  return error instanceof UpstreamError;
}
