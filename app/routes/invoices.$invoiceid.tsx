import {
  ArrowUturnLeftIcon,
  DocumentCurrencyPoundIcon,
  PencilSquareIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { Prisma } from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import FormAnchorButton from "~/components/FormAnchorBtn";
import FormBtn from "~/components/FormBtn";
import { getInvoiceBuffer } from "~/components/InvoicePDFDoc";
import Modal from "~/components/Modal";
import ShareInvoiceFrom from "~/components/ShareInvoiceForm";
import { getInvoiceById } from "~/controllers/invoices";
import { getUserByEmail } from "~/controllers/users";
import { mailer } from "~/entry.server";
import { SITE_TITLE, UserContext } from "~/root";
import { emailBodyData, sendEmail } from "~/utils/mailer";
import { getUserId } from "~/utils/session";
import { respMidTDClass, respTDClass, respTRClass } from "~/utils/styleClasses";
import type { InvoicedProductsType, InvoicesType } from "~/utils/types";
import { validateEmail } from "~/utils/validations";
import {
  getCurrencyString,
  getGrandTotal,
  getSubtotal,
  prettifyDateString,
  prettifyFilename,
} from "../utils/formatters";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - View invoice` }];
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  const { invoiceid } = params;
  const id = invoiceid as string;
  try {
    const invoice = await getInvoiceById(parseInt(id));
    return json({ invoice });
  } catch (err) {
    console.error(err);
    return {};
  }
};

const getEmailsFromEntry = (emailsEntry: FormDataEntryValue) => {
  return emailsEntry
    ? String(emailsEntry)
        .split(",")
        .map((othEmail: string) => othEmail.trim())
    : [];
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "share_invoice":
      const {
        invoiceid,
        customerEmail,
        userEmail,
        otherEmails,
        subtotal,
        labour,
        discount,
        grandTotal,
        productCount,
        isVatInvoice,
        ...productData
      } = values;
      const shareActionErrors: any = {};

      if (!customerEmail && !userEmail && !otherEmails)
        return {
          shareActionErrors: {
            msg: "One option has to be selected or defined!",
          },
        };

      const othEmails = getEmailsFromEntry(otherEmails);

      othEmails.forEach((oe) => (shareActionErrors.msg = validateEmail(oe)));

      if (Object.values(shareActionErrors).some(Boolean))
        return { shareActionErrors };

      const allEmails: string[] = [
        ...othEmails,
        ...(customerEmail ? [String(customerEmail)] : []),
        ...(userEmail ? [String(userEmail)] : []),
      ];

      const emailBodyData: emailBodyData = {
        documentid: invoiceid,
        subtotal,
        labour,
        discount,
        grandTotal,
        productCount,
        productData,
        type: "invoice",
      };

      const user = await getUserByEmail(`${userEmail}`);

      const pdfBuffer = await getInvoiceBuffer(
        invoiceid as string,
        isVatInvoice === "on",
        user && user.address ? `${user.address}` : ""
      );

      let mailResponse: any;
      try {
        mailResponse = await sendEmail(allEmails, emailBodyData, pdfBuffer);
      } catch (error: any) {
        if (error.code === "ETIMEDOUT")
          return { shareActionErrors: { msg: "Error: send request timeout!" } };
        else
          return {
            shareActionErrors: {
              msg: "Error: something went wrong (unhandled)!",
            },
          };
      }

      if (process.env.NODE_ENV === "development") {
        console.log("message sent:", mailer.getTestMessageUrl(mailResponse));
      }

      if (mailResponse.accepted && mailResponse.accepted.length > 0)
        return { shareActionErrors: { msg: "mail sent!" } };
      return {
        shareActionErrors: {
          msg: "Error: something went wrong (unhandled)!",
        },
      };
  }
  return {};
}

export default function InvoiceId() {
  const user: any = useContext(UserContext);
  const { invoice } = useLoaderData();
  const {
    invoice_id,
    createdAt,
    discount,
    labour,
    customer,
    invoiced_products,
  }: InvoicesType = invoice;
  const navigation = useNavigation();
  const data = useActionData();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const [subtotal, setSubtotal] = useState(new Prisma.Decimal(0));
  const [grandTotal, setGrandTotal] = useState(new Prisma.Decimal(0));
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    setSubtotal(getSubtotal(invoiced_products));
  }, [invoiced_products]);

  useEffect(() => {
    setGrandTotal(
      getGrandTotal(
        subtotal,
        new Prisma.Decimal(labour),
        new Prisma.Decimal(discount)
      )
    );
  }, [discount, labour, subtotal]);

  return (
    <div>
      <h2>Invoice</h2>
      <p>Created on: {prettifyDateString(createdAt)}</p>
      <h3>Customer</h3>
      <p>
        Name: {customer.name}
        <br />
        Address: {customer.address}
        <br />
        Tel: {customer.tel}
        <br />
        Email: {customer.email}
      </p>
      <h3>Products</h3>
      <div className="-m-4 md:m-0">
        <table className="table">
          <thead>
            <tr className="hidden md:table-row">
              <th>Name</th>
              <th>Quantity</th>
              <th className="text-right">Unit price</th>
              <th className="text-right">Item total</th>
            </tr>
          </thead>
          <tbody>
            {invoiced_products &&
              invoiced_products.map(
                ({
                  invprod_id,
                  name,
                  quantity,
                  price,
                }: InvoicedProductsType) => {
                  return (
                    <tr key={invprod_id} className={respTRClass}>
                      <td data-label="Name: " className={respMidTDClass}>
                        {name}
                      </td>
                      <td data-label="Quantity: " className={respMidTDClass}>
                        {quantity}
                      </td>
                      <td
                        data-label="Unit price: "
                        className={`${respMidTDClass} md:text-right`}
                      >
                        {getCurrencyString(price)}
                      </td>
                      <td
                        data-label="Item total: "
                        className={`${respTDClass} md:text-right`}
                      >
                        {getCurrencyString(Prisma.Decimal.mul(price, quantity))}
                      </td>
                    </tr>
                  );
                }
              )}
            <tr className={respTRClass}>
              <td
                colSpan={3}
                className={`${respTDClass} hidden md:table-cell`}
              ></td>
              <td className={`${respTDClass} md:text-right`}>
                Subtotal: {getCurrencyString(subtotal)}
              </td>
            </tr>
            <tr className={respTRClass}>
              <td
                colSpan={3}
                className={`${respTDClass} hidden md:table-cell`}
              ></td>
              <td className={`${respTDClass} md:text-right`}>
                Labour: {getCurrencyString(labour)}
              </td>
            </tr>
            <tr className={respTRClass}>
              <td
                colSpan={3}
                className={`${respTDClass} hidden md:table-cell`}
              ></td>
              <td className={`${respTDClass} md:text-right`}>
                Discount: -{getCurrencyString(discount)}
              </td>
            </tr>
            <tr className={respTRClass}>
              <td
                colSpan={3}
                className={`${respTDClass} hidden md:table-cell`}
              ></td>
              <td className={`${respTDClass} md:text-right`}>
                Total: {getCurrencyString(grandTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex flex-row justify-end gap-2">
        <FormAnchorButton
          href={`/invoices/${invoice_id}/edit`}
          isSubmitting={isSubmitting}
        >
          <PencilSquareIcon className="h-5 w-5 stroke-2" />
        </FormAnchorButton>
        <FormAnchorButton
          href={`/pdfs/${prettifyFilename(
            "scuk_invoice",
            invoice_id,
            "pdf"
          )}?type=invoice&id=${invoice_id}`}
          target="_blank"
          rel="noreferrer"
          isSubmitting={isSubmitting}
        >
          <DocumentCurrencyPoundIcon className="h-5 w-5 stroke-2" />
        </FormAnchorButton>
        <FormAnchorButton
          href={`/pdfs/${prettifyFilename(
            "scuk_invoice",
            invoice_id,
            "pdf"
          )}?type=invoice&id=${invoice_id}&isvat=true`}
          target="_blank"
          rel="noreferrer"
          isSubmitting={isSubmitting}
        >
          <div className="indicator">
            <span className="indicator-item indicator-bottom indicator-center badge badge-xs">
              VAT
            </span>
            <DocumentCurrencyPoundIcon className="h-5 w-5 stroke-2" />
          </div>
        </FormAnchorButton>
        <FormBtn
          isSubmitting={isSubmitting}
          onClick={() => {
            setShowShareModal(true);
          }}
        >
          <ShareIcon className="h-5 w-5 stroke-2" />
        </FormBtn>
        <FormAnchorButton
          onClick={() => {
            navigate(-1);
          }}
          isSubmitting={isSubmitting}
        >
          <ArrowUturnLeftIcon className="h-5 w-5 stroke-2" />
        </FormAnchorButton>
      </div>
      <Modal open={showShareModal}>
        <h3 className="mb-4">Share with:</h3>
        {showShareModal && (
          <ShareInvoiceFrom
            invoiceid={invoice.invoice_id}
            customer={customer}
            productData={{ invoiced_products, labour, discount, grandTotal }}
            user={user}
            navigation={navigation}
            formErrors={data?.shareActionErrors}
            onCancel={() => {
              setShowShareModal(false);
              if (data) data.shareActionErrors = {};
            }}
          />
        )}
      </Modal>
    </div>
  );
}
