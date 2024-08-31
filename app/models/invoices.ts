import { Prisma } from "@prisma/client";
import { db } from "../utils/db";

export const getInvoices = () => {
  return db.invoices.findMany({
    include: {
      customer: true,
      invoiced_products: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};

export const getInvoiceById = (invoice_id: number) => {
  return db.invoices.findUnique({
    where: {
      invoice_id,
    },
    include: {
      customer: true,
      invoiced_products: true,
    },
  });
};

export const createInvoice = (data: any) => {
  const { customer, labour, discount, invoicedProducts } = data;
  const newInvoice: Prisma.invoicesCreateInput = {
    customer: {
      connect: {
        customer_id: parseInt(`${customer}`),
      },
    },
    invoiced_products: {
      createMany: {
        data: invoicedProducts,
      },
    },
    labour: Number(`${labour}`),
    discount: Number(`${discount}`),
  };
  return db.invoices.create({ data: newInvoice });
};

export const deleteInvoiceById = (invoice_id: number) => {
  return db.$transaction([
    db.invoiced_products.deleteMany({
      where: {
        invoice_id,
      },
    }),
    db.invoices.delete({
      where: {
        invoice_id,
      },
    }),
  ]);
};