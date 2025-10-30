import { getQuoteById } from "~/controllers/quotes";
import type { QuotesWithCustomersType } from "~/utils/types";
import { RPDFDoc } from "./rpdf/RPDFDoc";
import { RPDFRenderToBuffer } from "./rpdf/RPDFRenderToBuffer";

export const getQuoteBuffer = async (quote_id: string) => {
  const { quote } = await getQuoteById({ quote_id });

  return RPDFRenderToBuffer({
    document: <QuotePDFDoc quote={quote} />,
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
