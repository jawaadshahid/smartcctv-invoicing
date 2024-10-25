import type { Prisma, customers } from "@prisma/client";

export type QuotedProductsType = {
  invprod_id: number;
  quote_id: number;
  name: string;
  quantity: number;
  price: Prisma.Decimal;
};

export type QuotesWithCustomersType = Prisma.quotesGetPayload<{
  include: { customer: true; quoted_products: true };
}>;

export type QuotesType = Prisma.quotesGetPayload<{
  include: { quoted_products: true };
}>;

export type InvoicesWithCustomersType = Prisma.invoicesGetPayload<{
  include: { customer: true; invoiced_products: true };
}>;

export type InvoicesType = Prisma.invoicesGetPayload<{
  include: { invoiced_products: true };
}>;

export type CustomerType = Prisma.customersGetPayload<{
  include: {
    invoice: { include: { invoiced_products: true } };
    quote: { include: { quoted_products: true } };
  };
}>;
