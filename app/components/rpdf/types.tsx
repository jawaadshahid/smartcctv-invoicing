import type {
  Prisma,
  customers,
  invoiced_products,
  quoted_products,
} from "@prisma/client";
import type { ReactNode } from "react";

export type RPDFDocProps = {
  docTitle: string;
  headerText: string;
  customer: customers;
  products: invoiced_products[] | quoted_products[];
  labour: Prisma.Decimal;
  discount: Prisma.Decimal;
  isVat?: boolean;
};
export type RPDFHeaderProps = { children: ReactNode };
export type RPDFCustomerProfileProps = { customer: customers };
export type RPDFProdductTableRowProps = {
  products: (invoiced_products | quoted_products)[];
};
export type RPDFProductTableProps = {
  products: invoiced_products[] | quoted_products[];
};
export type RPDFProductTotalsProps = {
  subtotal: Prisma.Decimal;
  labour: Prisma.Decimal;
  discount: Prisma.Decimal;
  grandTotal: Prisma.Decimal;
  isVat?: boolean;
};
export type RPDFRenderToBufferProps = {
  document: React.ReactElement;
};
