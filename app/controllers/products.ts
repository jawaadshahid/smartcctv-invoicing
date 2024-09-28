import {
  createProduct as insertProduct,
  updateProduct as putProduct,
  deleteOrphanedBrands as removeOrphanedBrands,
  deleteOrphanedModels as removeOrphanedModels,
  deleteOrphanedTypes as removeOrphanedTypes,
  deleteProductById as removeProductById,
  getBrands as selectBrands,
  getBrandsBySearch as selectBrandsBySearch,
  getModels as selectModels,
  getModelsBySearch as selectModelsBySearch,
  getProductById as selectProductById,
  getProducts as selectProducts,
  getProductsBySearch as selectProductsBySearch,
  getProductsCount as selectProductsCount,
  getTypes as selectTypes,
  getTypesBySearch as selectTypesBySearch,
} from "../models/products";

export const getProducts = async (
  skip: number | undefined = undefined,
  take: number | undefined = undefined
) => {
  return await selectProducts(skip, take);
};

export const getProductsCount = async () => {
  return await selectProductsCount();
};

export const getProductById = async (product_id: number) => {
  return await selectProductById(product_id);
};

export const getProductsBySearch = async (search_term: string) => {
  return await selectProductsBySearch(search_term);
};

export const getProductsByIds = async (product_ids: number[]) => {
  return await Promise.all(
    product_ids.map((product_id) => getProductById(product_id))
  );
};

export const updateProduct = async (data: any) => {
  return await putProduct(data);
};

export const createProduct = async (data: any) => {
  return await insertProduct(data);
};

export const deleteProductById = async (product_id: number) => {
  return await removeProductById(product_id);
};

export const getBrands = async () => {
  return await selectBrands();
};

export const deleteOrphanedBrands = async () => {
  return await removeOrphanedBrands();
};

export const getBrandsBySearch = async (search_term: string) => {
  return await selectBrandsBySearch(search_term);
};

export const getTypes = async () => {
  return await selectTypes();
};

export const deleteOrphanedTypes = async () => {
  return await removeOrphanedTypes();
};

export const getTypesBySearch = async (search_term: string) => {
  return await selectTypesBySearch(search_term);
};

export const getModels = async () => {
  return await selectModels();
};

export const deleteOrphanedModels = async () => {
  return await removeOrphanedModels();
};

export const getModelsBySearch = async (search_term: string) => {
  return await selectModelsBySearch(search_term);
};
