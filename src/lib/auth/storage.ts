const AUTH_STORAGE_KEYS = [
  "token",
  "username",
  "userId",
  "profileImage",
] as const;

export function clearAuthStorage(storage: Pick<Storage, "removeItem">): void {
  AUTH_STORAGE_KEYS.forEach((key) => storage.removeItem(key));
}
