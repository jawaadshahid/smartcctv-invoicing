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

export {
  db,
  getUserByEmail,
  getUserById,
  deleteUserById,
  deleteProductById,
  deleteCustomerById,
};
