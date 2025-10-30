import { getInvoiceById } from "~/controllers/invoices";
import { getUserByEmail } from "~/controllers/users";
import { prettifyDateString } from "~/utils/formatters";
import type { InvoicesWithCustomersType } from "~/utils/types";
import { RPDFDoc } from "./rpdf/RPDFDoc";
import { RPDFRenderToBuffer } from "./rpdf/RPDFRenderToBuffer";

export const getInvoiceBuffer = async (
  invoice_id: string,
  isVat: boolean,
  userEmail: string
) => {
  const { invoice } = await getInvoiceById({ invoice_id });
  const user = await getUserByEmail(`${userEmail}`);
  if (!user)
    return {
      error: {
        code: 500,
        message: "Internal server error: there was a problem generating PDF",
      },
    };
  return RPDFRenderToBuffer({
    document: (
      <InvoicePDFDoc
        invoice={invoice}
        isVat={isVat}
        userAddress={`${user.address}`}
      />
    ),
  });
};

const InvoicePDFDoc = ({
  invoice,
  isVat,
  userAddress,
}: {
  invoice: InvoicesWithCustomersType;
  isVat: boolean;
  userAddress: string;
}) => {
  const {
    invoice_id,
    createdAt,
    customer,
    labour,
    discount,
    invoiced_products,
  } = invoice;
  return (
    <RPDFDoc
      docTitle={`CCTV Alarm invoice #${invoice_id}, for ${customer.name}`}
      headerText={`${userAddress
        .split(", ")
        .join(`${"\n"}`)}${"\n"}${prettifyDateString(createdAt.toString())}`}
      customer={customer}
      products={invoiced_products}
      labour={labour}
      discount={discount}
      isVat={isVat}
    />
  );
};

export default InvoicePDFDoc;
