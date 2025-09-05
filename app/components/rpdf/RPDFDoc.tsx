import type { invoiced_products, quoted_products } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { getGrandTotal, getSubtotal } from "~/utils/formatters";
import { RPDFCustomerProfile } from "./RPDFCustomerProfile";
import { RPDFFooter } from "./RPDFFooter";
import { RPDFHeader } from "./RPDFHeader";
import { RPDFProductTable } from "./RPDFProductTable";
import { RPDFProductTotals } from "./RPDFProductTotals";
import { RPDFStyles } from "./RPDFStyles";
import type { RPDFDocProps } from "./types";

export const RPDFDoc = ({
  docTitle,
  headerText,
  customer,
  products,
  labour,
  discount,
  isVat,
}: RPDFDocProps) => {
  const vatExcludedProducts = products.map((prod) => {
    return {
      ...prod,
      price: Prisma.Decimal.mul(prod.price, 0.8),
    };
  }) as invoiced_products[] | quoted_products[];
  const subtotal = getSubtotal(isVat ? vatExcludedProducts : products);
  const grandTotal = getGrandTotal(getSubtotal(products), labour, discount);
  return (
    <Document title={docTitle}>
      <Page size="A4" style={RPDFStyles.page}>
        <RPDFHeader>
          <Text style={RPDFStyles.rightText}>{headerText}</Text>
        </RPDFHeader>
        <View style={{ padding: "15 20" }}>
          <RPDFCustomerProfile customer={customer} />
          <RPDFProductTable products={isVat ? vatExcludedProducts : products} />
          <RPDFProductTotals
            subtotal={subtotal}
            labour={labour}
            discount={discount}
            grandTotal={grandTotal}
            isVat={isVat}
          />
        </View>
        <RPDFFooter />
      </Page>
    </Document>
  );
};
