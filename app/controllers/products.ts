import {
  createProduct as insertProduct,
  updateProduct as putProduct,
  deleteOrphanedBrands as removeOrphanedBrands,
  deleteOrphanedModels as removeOrphanedModels,
  deleteOrphanedTypes as removeOrphanedTypes,
  deleteProductById as removeProductById,
  getBrands as selectBrands,
  getModels as selectModels,
  getProductById as selectProductById,
  getProducts as selectProducts,
  getProductsBySearch as selectProductsBySearch,
  getTypes as selectTypes,
} from "../models/products";

export const getProducts = async () => {
  return await selectProducts();
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

export const getTypes = async () => {
  return await selectTypes();
};

export const deleteOrphanedTypes = async () => {
  return await removeOrphanedTypes();
};

export const getModels = async () => {
  return await selectModels();
};

export const deleteOrphanedModels = async () => {
  return await removeOrphanedModels();
};
