import { Prisma } from "@prisma/client";
import { db } from "../utils/db";

export const getQuotes = () => {
  return db.quotes.findMany({
    include: {
      customer: true,
      quoted_products: true,
    },
    orderBy: {
      createdAt: "desc",
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

export const getQuotesByCustomerIds = (customer_ids: number[]) => {
  return db.quotes.findMany({
    where: {
      customer_id: {
        in: customer_ids,
      },
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
