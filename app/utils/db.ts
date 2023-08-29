import { Prisma, PrismaClient } from "@prisma/client";

declare const global: Global & { db?: PrismaClient };

export let db: PrismaClient;

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

// users
export const getUsers = () => {
  return db.users.findMany();
};

export const getUserByEmail = (email: string) => {
  return db.users.findFirst({
    where: { email },
  });
};

export const getUserById = (id: number) => {
  return db.users.findFirst({
    where: { id },
  });
};

export const createUser = (isAdmin: boolean, data: any) => {
  const { firstname, lastname, email, password } = data;
  return db.users.create({
    data: {
      firstName: `${firstname}`,
      lastName: `${lastname}`,
      email: `${email}`,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAdmin: isAdmin ? 1 : 0,
      isApproved: isAdmin ? 1 : 0,
    },
  });
};

export const updateUserById = (id: number, data: any) => {
  const { firstname, lastname, email, newpassword } = data;
  return db.users.update({
    where: {
      id,
    },
    data: {
      firstName: `${firstname}`,
      lastName: `${lastname}`,
      email: `${email}`,
      ...(newpassword && { password: newpassword }),
      updatedAt: new Date(),
    },
  });
};

export const approveUserById = (id: number) => {
  return db.users.update({
    where: { id },
    data: { isApproved: 1 },
  });
};

export const deleteUserById = (id: number) => {
  return db.users.delete({
    where: { id },
  });
};

// products
export const getProducts = () => {
  return db.products.findMany();
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

export const getProductInput = (data: any): Prisma.productsCreateInput => {
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

// customers
export const getCustomers = () => {
  return db.customers.findMany();
};

export const createCustomer = (data: any) => {
  const { name, tel, email, address } = data;
  return db.customers.create({
    data: {
      name: `${name}`,
      tel: `${tel}`,
      email: `${email}`,
      address: `${address}`,
    },
  });
};

export const deleteCustomerById = (customer_id: number) => {
  return db.customers.delete({
    where: { customer_id },
  });
};

// quotes
export const getQuotes = () => {
  return db.quotes.findMany({
    include: {
      customer: true,
      quoted_products: true,
    },
  });
};

export const getQuoteById = (quote_id: number) => {
  return db.quotes.findUnique({
    where: {
      quote_id,
    },
    include: {
      customer: true,
      quoted_products: true,
    },
  });
};

export const createQuote = (data: any) => {
  const { customer, labour, discount, quotedProducts } = data;
  const newQuote: Prisma.quotesCreateInput = {
    customer: {
      connect: {
        customer_id: parseInt(`${customer}`),
      },
    },
    quoted_products: {
      createMany: {
        data: quotedProducts,
      },
    },
    labour: Number(`${labour}`),
    discount: Number(`${discount}`),
  };
  return db.quotes.create({ data: newQuote });
};

export const deleteQuoteById = (quote_id: number) => {
  return db.$transaction([
    db.quoted_products.deleteMany({
      where: {
        quote_id,
      },
    }),
    db.quotes.delete({
      where: {
        quote_id,
      },
    }),
  ]);
};
