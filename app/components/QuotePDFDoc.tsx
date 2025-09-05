import { renderToStream } from "@react-pdf/renderer";
import { getQuoteById } from "~/controllers/quotes";
import type { QuotesWithCustomersType } from "~/utils/types";
import { RPDFDoc } from "./rpdf/RPDFDoc";

export const getQuoteBuffer = async (quote_id: string) => {
  const { quote } = await getQuoteById({ quote_id });

  let stream = await renderToStream(<QuotePDFDoc quote={quote} />);
  // and transform it to a Buffer to send in the Response
  return new Promise((resolve, reject) => {
    let buffers: Uint8Array[] = [];
    stream.on("data", (data) => buffers.push(data));
    stream.on("end", () => resolve(Buffer.concat(buffers)));
    stream.on("error", () =>
      reject({
        code: 500,
        message: "Internal server error: there was a problem generating PDF",
      })
    );
  });
};

const QuotePDFDoc = ({ quote }: { quote: QuotesWithCustomersType }) => {
  const { quote_id, createdAt, customer, labour, discount, quoted_products } =
    quote;
  const date = new Date(createdAt);
  return (
    <RPDFDoc
      docTitle={`CCTV Alarm quote #${quote_id}, for ${customer.name}`}
      headerText={date.toDateString()}
      customer={customer}
      products={quoted_products}
      labour={labour}
      discount={discount}
      isVat={false}
    />
  );
};

export default QuotePDFDoc;
