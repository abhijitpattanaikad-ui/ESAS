export type ApiGameAssets = {
  thumbnail: string;
  desktopBanner?: string;
  mobileBanner?: string;
};

export type ApiGameResponse = {
  _id: string;
  name: string;
  assets?: ApiGameAssets;
};

export type ApiBrand = {
  _id: string;
  name: string;
  thumbnail: string;
  isActive: boolean;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function nonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function listFrom(value: unknown, key: "games" | "brands"): unknown[] | null {
  if (Array.isArray(value)) return value;
  const record = asRecord(value);
  return record && Array.isArray(record[key]) ? record[key] : null;
}

export function parseGameList(value: unknown): ApiGameResponse[] | null {
  const source = listFrom(value, "games");
  if (!source) return null;

  return source.flatMap((candidate) => {
    const item = asRecord(candidate);
    const id = nonEmptyString(item?._id);
    const name = nonEmptyString(item?.name);
    if (!item || !id || !name) return [];

    const rawAssets = asRecord(item.assets);
    const thumbnail = nonEmptyString(rawAssets?.thumbnail);
    const desktopBanner = nonEmptyString(rawAssets?.desktopBanner);
    const mobileBanner = nonEmptyString(rawAssets?.mobileBanner);

    const assets = thumbnail
      ? {
          thumbnail,
          ...(desktopBanner ? { desktopBanner } : {}),
          ...(mobileBanner ? { mobileBanner } : {}),
        }
      : undefined;

    return [{ _id: id, name, ...(assets ? { assets } : {}) }];
  });
}

export function parseBrandList(value: unknown): ApiBrand[] | null {
  const source = listFrom(value, "brands");
  if (!source) return null;

  return source.flatMap((candidate) => {
    const item = asRecord(candidate);
    const id = nonEmptyString(item?._id);
    const name = nonEmptyString(item?.name);
    const thumbnail = nonEmptyString(item?.thumbnail);
    if (!item || !id || !name || !thumbnail) return [];

    return [{ _id: id, name, thumbnail, isActive: item.isActive === true }];
  });
}
