import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

declare const global: Global & { db?: PrismaClient };

let db: PrismaClient;

if (typeof window === "undefined") {
  if (process.env["NODE_ENV"] === "production") {
    db = new PrismaClient();
  } else {
    if (!global.db) {
      global.db = new PrismaClient();
    }
    db = global.db;
  }
}

const getUserByEmail = (email: string) => {
  return db.users.findFirst({
    where: { email },
  });
};

const getUserById = (id: number) => {
  return db.users.findFirst({
    where: { id },
  });
};

const deleteUserById = (id: number) => {
  return db.users.delete({
    where: { id },
  });
};

const deleteProductById = (product_id: number) => {
  return db.products.delete({
    where: { product_id },
  });
};

const deleteCustomerById = (customer_id: number) => {
  return db.customers.delete({
    where: { customer_id },
  });
};

const createCustomer = (
  name: string,
  tel: string,
  email: string,
  address: string
) => {
  return db.customers.create({
    data: {
      name,
      tel,
      email,
      address,
    },
  });
};

const createProduct = (
  brand: string,
  newbrand: string,
  type: string,
  newtype: string,
  model: string,
  newmodel: string,
  price: string
) => {
  const isBrandSelected = brand && parseInt(brand) > 0;
  const isTypeSelected = type && parseInt(type) > 0;
  const isModelSelected = model && parseInt(model) > 0;

  const newProduct: Prisma.productsCreateInput = {
    brand: isBrandSelected
      ? { connect: { brand_id: parseInt(brand) } }
      : { create: { brand_name: newbrand } },
    type: isTypeSelected
      ? { connect: { type_id: parseInt(type) } }
      : { create: { type_name: newtype } },
    model: isModelSelected
      ? { connect: { model_id: parseInt(model) } }
      : { create: { model_name: newmodel } },
    price: Number(price),
  };

  return db.products.create({ data: newProduct });
};

export {
  db,
  getUserByEmail,
  getUserById,
  deleteUserById,
  deleteProductById,
  deleteCustomerById,
  createCustomer,
  createProduct
};
