import type { Prisma, customers } from "@prisma/client";

export type QuotedProductsType = {
  invprod_id: number;
  quote_id: number;
  name: string;
  quantity: number;
  price: Prisma.Decimal;
};

export type QuotesType = {
  quote_id: number;
  createdAt: string;
  updatedAt: string;
  customer: customers;
  labour: Prisma.Decimal;
  discount: Prisma.Decimal;
  quoted_products: QuotedProductsType[];
};

export type InvoicedProductsType = {
  invprod_id: number;
  invoice_id: number;
  name: string;
  quantity: number;
  price: Prisma.Decimal;
};

export type InvoicesType = {
  invoice_id: number;
  createdAt: string;
  updatedAt: string;
  customer: customers;
  labour: Prisma.Decimal;
  discount: Prisma.Decimal;
  invoiced_products: InvoicedProductsType[];
};