import { error, getErrorFromPrismaError } from "~/utils/errors";
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
  getProductsByIds as selectProductsByIds,
} from "../models/products";
import { validateProductData, validateSearchTerm } from "~/utils/validations";

type formData = { [key: string]: FormDataEntryValue };

export const getProducts = async (data: formData) => {
  const { skip, take } = data;
  if (!skip || !take)
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to retrieve products",
    });
  const skipNum = parseInt(`${skip}`);
  const takeNum = parseInt(`${take}`);
  if (isNaN(skipNum) || isNaN(takeNum))
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to retrieve products",
    });
  try {
    const pagedProducts = await selectProducts(skipNum, takeNum);
    return Promise.resolve({ code: 200, pagedProducts });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to retrieve products`,
    });
  }
};

export const getProductsCount = async () => {
  try {
    const productCount = await selectProductsCount();
    return Promise.resolve({ code: 200, productCount });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to retrieve product count`,
    });
  }
};

export const getProductById = async (product_id: number) => {
  return await selectProductById(product_id);
};

export const getProductsBySearch = async (data: formData) => {
  const { search_term } = data;
  const sanitisedTerm = `${search_term}`.trim();
  const searchTermError = validateSearchTerm(sanitisedTerm);
  if (searchTermError)
    return Promise.reject({
      code: 400,
      message: `Bad request: ${searchTermError}`,
    });
  if (!sanitisedTerm) return Promise.resolve({ code: 200, products: [] });
  try {
    const products = await selectProductsBySearch(sanitisedTerm);
    return Promise.resolve({ code: 200, products });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to retrieve products`,
    });
  }
};

export const getProductsByIds = async (product_ids: number[]) => {
  return await selectProductsByIds(product_ids);
};

export const updateProduct = async (data: formData) => {
  const { product_id } = data;
  if (!product_id)
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to update product",
    });
  const productIdNum = parseInt(`${product_id}`);
  if (isNaN(productIdNum))
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to update product",
    });
  try {
    const updatedProduct = await putProduct({
      product_id: productIdNum,
      ...data,
    });
    return Promise.resolve({ code: 200, updatedProduct });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to update product`,
    });
  }
};

export const createProduct = async (data: formData) => {
  const createProductErrors = validateProductData(data);
  if (createProductErrors)
    return Promise.reject({
      code: 400,
      message: `Bad request: ${createProductErrors}`,
    });
  try {
    const createdProduct = await insertProduct(data);
    return Promise.resolve({ code: 201, createdProduct });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to create product`,
    });
  }
};

export const deleteProductById = async (data: formData) => {
  const { product_id } = data;
  if (!product_id)
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to delete product",
    });
  const productIdNum = parseInt(`${product_id}`);
  if (isNaN(productIdNum))
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to delete product",
    });
  try {
    const deletedProduct = await removeProductById(productIdNum);
    return Promise.resolve({ code: 201, deletedProduct });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to delete product`,
    });
  }
};

export const deleteOrphanedTaxonomy = async (data: formData) => {
  const { brands, types, models } = data;
  const taxonomiesToCheck = [
    ...(brands ? ["brands"] : []),
    ...(types ? ["types"] : []),
    ...(models ? ["models"] : []),
  ];

  const taxonomyPromises: Promise<any>[] = [];
  taxonomiesToCheck.forEach((taxoName) => {
    switch (taxoName) {
      case "brands":
        taxonomyPromises.push(removeOrphanedBrands());
        break;
      case "types":
        taxonomyPromises.push(removeOrphanedTypes());
        break;
      case "models":
        taxonomyPromises.push(removeOrphanedModels());
        break;
    }
  });

  if (taxonomyPromises.length === 0)
    return Promise.reject({
      code: 400,
      message: "Bad request: atleast one product taxonomy should be selected",
    });
  try {
    const taxonomyData = await Promise.allSettled(taxonomyPromises);

    const deletedTaxonomy: {
      [key: string]: { error?: error; count?: number };
    } = {};
    taxonomyData.forEach((taxoResponse: PromiseSettledResult<any>) => {
      const { status } = taxoResponse;
      const taxoName = taxonomiesToCheck.shift();
      if (!taxoName) return;
      deletedTaxonomy[taxoName] =
        status === "fulfilled"
          ? taxoResponse.value
          : {
              error: {
                code: 500,
                message: `failed to deleted product ${taxoName} item(s)`,
              },
            };
    });
    return Promise.resolve({ code: 201, deletedTaxonomy });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to delete product taxonomies`,
    });
  }
};

export const getBrands = async () => {
  return await selectBrands();
};

export const getBrandsBySearch = async (data: formData) => {
  const { search_term } = data;
  const sanitisedTerm = `${search_term}`.trim();
  const searchTermError = validateSearchTerm(sanitisedTerm);
  if (searchTermError)
    return Promise.reject({
      code: 400,
      message: `Bad request: ${searchTermError}`,
    });
  if (!sanitisedTerm) return Promise.resolve({ code: 200, brands: [] });
  try {
    const brands = await selectBrandsBySearch(sanitisedTerm);
    return Promise.resolve({ code: 200, brands });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to retrieve product brands`,
    });
  }
};

export const getTypes = async () => {
  return await selectTypes();
};

export const getTypesBySearch = async (data: formData) => {
  const { search_term } = data;
  const sanitisedTerm = `${search_term}`.trim();
  const searchTermError = validateSearchTerm(sanitisedTerm);
  if (searchTermError)
    return Promise.reject({
      code: 400,
      message: `Bad request: ${searchTermError}`,
    });
  if (!sanitisedTerm) return Promise.resolve({ code: 200, types: [] });
  try {
    const types = await selectTypesBySearch(sanitisedTerm);
    return Promise.resolve({ code: 200, types });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to retrieve product types`,
    });
  }
};

export const getModels = async () => {
  return await selectModels();
};

export const getModelsBySearch = async (data: formData) => {
  const { search_term } = data;
  const sanitisedTerm = `${search_term}`.trim();
  const searchTermError = validateSearchTerm(sanitisedTerm);
  if (searchTermError)
    return Promise.reject({
      code: 400,
      message: `Bad request: ${searchTermError}`,
    });
  if (!sanitisedTerm) return Promise.resolve({ code: 200, models: [] });
  try {
    const models = await selectModelsBySearch(sanitisedTerm);
    return Promise.resolve({ code: 200, models });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to retrieve product models`,
    });
  }
};
