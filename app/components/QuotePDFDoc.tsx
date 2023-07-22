import type { customers, quoted_products } from "@prisma/client";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  renderToStream,
} from "@react-pdf/renderer";
import { db } from "~/utils/db";

type QuotesType = {
  quote_id: number;
  createdAt: string;
  updatedAt: string;
  customer: customers;
  labour: number;
  quoted_products: quoted_products[];
};

export const getQuoteBuffer = async (quoteid: string | undefined) => {
  if (!quoteid) return Promise.reject({ error: "quote id is not defined" });
  const id = quoteid as string;
  let quote: any;
  try {
    quote = await db.quotes.findUnique({
      where: {
        quote_id: parseInt(id),
      },
      include: {
        customer: true,
        quoted_products: true,
      },
    });
  } catch (error) {
    Promise.reject({ error });
  }

  let stream = await renderToStream(<QuotePDFDoc quote={quote} />);
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

const QuotePDFDoc = ({ quote }: { quote: QuotesType }) => {
  const { quote_id, createdAt, customer, labour, quoted_products } = quote;
  const { name, tel, email, address } = customer;
  const date = new Date(createdAt);

  let grandTotal = 0;
  quoted_products.forEach(
    ({ price, quantity }) => (grandTotal += price * quantity)
  );
  grandTotal += labour;

  return (
    <Document title={`Smart CCTV quote #${quote_id}, for ${name}`}>
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
          <View style={styles.customerRow}>
            <Text style={styles.customerField}>Address:</Text>
            <Text style={styles.customerValue}>{address}</Text>
          </View>
          <View style={styles.customerRow}>
            <Text style={styles.customerField}>Tel:</Text>
            <Text style={styles.customerValue}>{tel}</Text>
          </View>
          <View style={styles.customerRow}>
            <Text style={styles.customerField}>Email:</Text>
            <Text style={styles.customerValue}>{email}</Text>
          </View>
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
                <Text>Total price</Text>
              </View>
            </View>
            {quoted_products &&
              quoted_products.map(
                ({ invprod_id, name, quantity, price }: quoted_products) => (
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
                      <Text>£{quantity}.00</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text>£{price}.00</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text>£{price * quantity}.00</Text>
                    </View>
                  </View>
                )
              )}
          </View>
          <View style={styles.endRow}>
            <Text style={styles.endField}>Labour:</Text>
            <Text style={styles.endValue}>£{labour}.00</Text>
          </View>
          <View style={styles.endRow}>
            <Text style={styles.endField}>Grand total:</Text>
            <Text style={styles.endValue}>£{grandTotal}.00</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default QuotePDFDoc;