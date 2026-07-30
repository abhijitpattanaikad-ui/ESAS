import { getBrandList } from "@/features/catalog/api";

export type { ApiBrand } from "@/features/catalog/contracts";

export const brandService = {
  getAllBrands: getBrandList,
};
