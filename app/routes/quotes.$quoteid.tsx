import { Prisma } from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import FormAnchorButton from "~/components/FormAnchorBtn";
import FormBtn from "~/components/FormBtn";
import Modal from "~/components/Modal";
import { getQuoteBuffer } from "~/components/QuotePDFDoc";
import ShareQuoteForm from "~/components/ShareQuoteForm";
import { getQuoteById } from "~/controllers/quotes";
import { mailer } from "~/entry.server";
import { SITE_TITLE, UserContext } from "~/root";
import { sendEmail } from "~/utils/mailer";
import { getUserId } from "~/utils/session";
import { TDClass, respTDClass, respTRClass } from "~/utils/styleClasses";
import type { QuotedProductsType, QuotesType } from "~/utils/types";
import { validateEmail } from "~/utils/validations";
import {
  constructEmailBody,
  getCurrencyString,
  getGrandTotal,
  getSubtotal,
  prettifyDateString,
} from "../utils/formatters";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - View quote ` }];
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  const { quoteid } = params;
  const id = quoteid as string;
  try {
    const quote = await getQuoteById(parseInt(id));
    return json({ quote });
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
    case "share_quote":
      const {
        quoteid,
        customerEmail,
        userEmail,
        otherEmails,
        subtotal,
        labour,
        discount,
        grandTotal,
        productCount,
        isVatQuote,
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

      const emailBody = constructEmailBody(
        subtotal,
        labour,
        discount,
        grandTotal,
        productCount,
        productData
      );

      const pdfBuffer = await getQuoteBuffer(
        quoteid as string,
        isVatQuote === "on"
      );

      let mailResponse: any;
      try {
        mailResponse = await sendEmail(allEmails, emailBody, pdfBuffer);
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

export default function QuoteId() {
  const user: any = useContext(UserContext);
  const { quote } = useLoaderData();
  const {
    quote_id,
    createdAt,
    discount,
    labour,
    customer,
    quoted_products,
  }: QuotesType = quote;
  const navigation = useNavigation();
  const data = useActionData();
  const isSubmitting = navigation.state === "submitting";
  const [subtotal, setSubtotal] = useState(new Prisma.Decimal(0));
  const [grandTotal, setGrandTotal] = useState(new Prisma.Decimal(0));
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    setSubtotal(getSubtotal(quoted_products));
  }, [quoted_products]);

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
      <h2>Quote</h2>
      <p>Created on: {prettifyDateString(createdAt)}</p>
      <h3>Customer</h3>
      <p>Name: {customer.name}</p>
      <p>Address: {customer.address}</p>
      <p>Tel: {customer.tel}</p>
      <p>Email: {customer.email}</p>
      <h3>Products</h3>
      <div className="-mx-4 md:mx-0">
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
            {quoted_products &&
              quoted_products.map(
                ({ invprod_id, name, quantity, price }: QuotedProductsType) => {
                  return (
                    <tr key={invprod_id} className={respTRClass}>
                      <td data-label="Name" className={respTDClass}>
                        {name}
                      </td>
                      <td data-label="Quantity" className={respTDClass}>
                        {quantity}
                      </td>
                      <td
                        data-label="Unit price"
                        className={`${respTDClass} md:text-right`}
                      >
                        {getCurrencyString(price)}
                      </td>
                      <td
                        data-label="Item total"
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
                className={`${TDClass} hidden md:table-cell`}
              ></td>
              <td className={`${TDClass} md:text-right`}>
                Subtotal: {getCurrencyString(subtotal)}
              </td>
            </tr>
            <tr className={respTRClass}>
              <td
                colSpan={3}
                className={`${TDClass} hidden md:table-cell`}
              ></td>
              <td className={`${TDClass} md:text-right`}>
                Labour: {getCurrencyString(labour)}
              </td>
            </tr>
            <tr className={respTRClass}>
              <td
                colSpan={3}
                className={`${TDClass} hidden md:table-cell`}
              ></td>
              <td className={`${TDClass} md:text-right`}>
                Discount: -{getCurrencyString(discount)}
              </td>
            </tr>
            <tr className={respTRClass}>
              <td
                colSpan={3}
                className={`${TDClass} hidden md:table-cell`}
              ></td>
              <td className={`${TDClass} md:text-right`}>
                Total: {getCurrencyString(grandTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:flex-row md:justify-end mt-4 gap-4">
        <FormAnchorButton
          href={`/quotes/${quote_id}/edit`}
          isSubmitting={isSubmitting}
        >
          Edit
        </FormAnchorButton>
        <FormAnchorButton
          href={`/quotes/${quote_id}/0/generatedquote`}
          target="_blank"
          rel="noreferrer"
          isSubmitting={isSubmitting}
        >
          Generate PDF
        </FormAnchorButton>
        <FormAnchorButton
          href={`/quotes/${quote_id}/1/generatedquote`}
          target="_blank"
          rel="noreferrer"
          isSubmitting={isSubmitting}
        >
          Generate VAT PDF
        </FormAnchorButton>
        <FormBtn
          isSubmitting={isSubmitting}
          onClick={() => {
            setShowShareModal(true);
          }}
        >
          Share
        </FormBtn>
        <FormAnchorButton href="/quotes" isSubmitting={isSubmitting}>
          Back
        </FormAnchorButton>
      </div>
      <Modal open={showShareModal}>
        <h3 className="mb-4">Share with:</h3>
        {showShareModal && (
          <ShareQuoteForm
            quoteid={quote.quote_id}
            customer={customer}
            productData={{ quoted_products, labour, discount, grandTotal }}
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
