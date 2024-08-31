import { invoiced_products, Prisma } from "@prisma/client";
import {
  Document,
  Image,
  Page,
  renderToStream,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { getInvoiceById } from "~/controllers/invoices";
import {
  getCurrencyString,
  getGrandTotal,
  getSubtotal,
} from "~/utils/formatters";
import type { InvoicesType } from "~/utils/types";

export const getInvoiceBuffer = async (
  invoiceid: string | undefined,
  isVat: boolean
) => {
  if (!invoiceid) return Promise.reject({ error: "invoice id is not defined" });
  const id = invoiceid as string;
  let invoice: InvoicesType | any;
  try {
    invoice = await getInvoiceById(parseInt(id));
  } catch (error) {
    return Promise.reject({ error });
  }

  if (!invoice) return Promise.reject({ msg: "invoice not found!" });

  let stream = await renderToStream(
    <InvoicePDFDoc invoice={invoice} isVat={isVat} />
  );
  // and transform it to a Buffer to send in the Response
  return new Promise((resolve, reject) => {
    let buffers: Uint8Array[] = [];
    stream.on("data", (data) => {
      buffers.push(data);
    });
    stream.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
    stream.on("error", reject);
  });
};

const styles = StyleSheet.create({
  page: {
    fontSize: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#000000",
    borderBottomWidth: 1,
  },
  logo: {
    width: 200,
  },
  customerRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  customerField: {
    width: 200,
  },
  customerValue: {},
  table: {
    marginTop: 5,
    borderWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
  },
  tableCell: {
    padding: "5 10",
    width: "15%",
    textAlign: "right",
    borderLeftWidth: 1,
  },
  endRow: {
    flexDirection: "row",
  },
  endField: {
    padding: "5 10",
    width: "85%",
    textAlign: "right",
  },
  endValue: {
    padding: "5 10",
    width: "15%",
    textAlign: "right",
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
});

const InvoicePDFDoc = ({
  invoice,
  isVat,
}: {
  invoice: InvoicesType;
  isVat: boolean;
}) => {
  const {
    invoice_id,
    createdAt,
    customer,
    labour,
    discount,
    invoiced_products,
  } = invoice;
  const { name, tel, email, address } = customer;
  const date = new Date(createdAt);
  const subtotal = getSubtotal(invoiced_products);
  const grandTotal = getGrandTotal(subtotal, labour, discount);
  const vatTotal = Prisma.Decimal.mul(grandTotal, 0.2);
  return (
    <Document title={`Smart CCTV invoice #${invoice_id}, for ${name}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image
            src="https://smartcctvuk.co.uk/img/logo-small.png"
            style={styles.logo}
          />
          <Text style={{ marginRight: 20 }}>{date.toDateString()}</Text>
        </View>
        <View style={{ margin: "15 20" }}>
          <View style={styles.customerRow}>
            <Text style={styles.customerField}>Name:</Text>
            <Text style={styles.customerValue}>{name}</Text>
          </View>
          {address ? (
            <View style={styles.customerRow}>
              <Text style={styles.customerField}>Address:</Text>
              <Text style={styles.customerValue}>{address}</Text>
            </View>
          ) : null}
          {tel ? (
            <View style={styles.customerRow}>
              <Text style={styles.customerField}>Tel:</Text>
              <Text style={styles.customerValue}>{tel}</Text>
            </View>
          ) : null}
          {email ? (
            <View style={styles.customerRow}>
              <Text style={styles.customerField}>Email:</Text>
              <Text style={styles.customerValue}>{email}</Text>
            </View>
          ) : null}
          <View style={styles.table}>
            <View style={[styles.tableRow, { borderTop: 0 }]}>
              <View
                style={[
                  styles.tableCell,
                  { textAlign: "left", width: "55%", borderLeftWidth: 0 },
                ]}
              >
                <Text>Product</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>Quantity</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>Unit price</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>Item total</Text>
              </View>
            </View>
            {invoiced_products &&
              invoiced_products.map(
                ({ invprod_id, name, quantity, price }: invoiced_products) => (
                  <View key={invprod_id} style={styles.tableRow}>
                    <View
                      style={[
                        styles.tableCell,
                        { textAlign: "left", width: "55%", borderLeftWidth: 0 },
                      ]}
                    >
                      <Text>{name}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text>{quantity}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text>{getCurrencyString(price)}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text>
                        {getCurrencyString(Prisma.Decimal.mul(price, quantity))}
                      </Text>
                    </View>
                  </View>
                )
              )}
          </View>
          <View style={styles.endRow}>
            <Text style={styles.endField}>Subtotal:</Text>
            <Text style={styles.endValue}>{getCurrencyString(subtotal)}</Text>
          </View>
          <View style={styles.endRow}>
            <Text style={styles.endField}>Labour:</Text>
            <Text style={styles.endValue}>{getCurrencyString(labour)}</Text>
          </View>
          {discount.toNumber() > 0 ? (
            <View style={styles.endRow}>
              <Text style={styles.endField}>Discount:</Text>
              <Text style={styles.endValue}>
                -{getCurrencyString(discount)}
              </Text>
            </View>
          ) : null}
          <View style={styles.endRow}>
            <Text style={styles.endField}>Total:</Text>
            <Text style={styles.endValue}>{getCurrencyString(grandTotal)}</Text>
          </View>
          {isVat ? (
            <>
              <View style={styles.endRow}>
                <Text style={styles.endField}>VAT:</Text>
                <Text style={styles.endValue}>
                  {getCurrencyString(vatTotal)}
                </Text>
              </View>
              <View style={styles.endRow}>
                <Text style={styles.endField}>Total (Inc VAT):</Text>
                <Text style={styles.endValue}>
                  {getCurrencyString(Prisma.Decimal.sum(grandTotal, vatTotal))}
                </Text>
              </View>
            </>
          ) : null}
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDFDoc;
