import { Prisma } from "@prisma/client";
import { db } from "../utils/db";

export const getProducts = () => {
  return db.products.findMany({
    orderBy: [
      { brand_name: "asc" },
      { type_name: "asc" },
      { model_name: "asc" },
      { price: "asc" },
    ],
  });
};

export const getProductById = (product_id: number) => {
  return db.products.findUnique({
    where: { product_id },
    include: {
      brand: true,
      model: true,
      type: true,
    },
  });
};

const getProductInput = (data: any): Prisma.productsCreateInput => {
  const { brand, newbrand, type, newtype, model, newmodel, price } = data;
  const isBrandSelected = `${brand}` && parseInt(`${brand}`) > 0;
  const isTypeSelected = `${type}` && parseInt(`${type}`) > 0;
  const isModelSelected = `${model}` && parseInt(`${model}`) > 0;
  return {
    brand: isBrandSelected
      ? { connect: { brand_id: parseInt(`${brand}`) } }
      : { create: { brand_name: `${newbrand}` } },
    type: isTypeSelected
      ? { connect: { type_id: parseInt(`${type}`) } }
      : { create: { type_name: `${newtype}` } },
    model: isModelSelected
      ? { connect: { model_id: parseInt(`${model}`) } }
      : { create: { model_name: `${newmodel}` } },
    price: new Prisma.Decimal(`${price}`),
  };
};

export const updateProduct = async (data: any) => {
  const { product_id } = data;
  return db.products.update({
    where: {
      product_id: parseInt(`${product_id}`),
    },
    data: getProductInput(data),
  });
};

export const createProduct = async (data: any) => {
  return db.products.create({ data: getProductInput(data) });
};

export const deleteProductById = (product_id: number) => {
  return db.products.delete({
    where: { product_id },
  });
};

export const getBrands = () => {
  return db.product_brands.findMany({
    orderBy: [{ brand_name: "asc" }],
  });
};

export const deleteOrphanedBrands = () => {
  return db.product_brands.deleteMany({
    where: {
      products: {
        none: {},
      },
    },
  });
};

export const getTypes = () => {
  return db.product_types.findMany({
    orderBy: [{ type_name: "asc" }],
  });
};

export const deleteOrphanedTypes = () => {
  return db.product_types.deleteMany({
    where: {
      products: {
        none: {},
      },
    },
  });
};

export const getModels = () => {
  return db.product_models.findMany({
    orderBy: [{ model_name: "asc" }],
  });
};

export const deleteOrphanedModels = () => {
  return db.product_models.deleteMany({
    where: {
      products: {
        none: {},
      },
    },
  });
};