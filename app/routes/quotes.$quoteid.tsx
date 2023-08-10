import type { customers, quoted_products } from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import FormAnchorButton from "~/components/FormAnchorBtn";
import FormBtn from "~/components/FormBtn";
import Modal from "~/components/Modal";
import { getQuoteBuffer } from "~/components/QuotePDFDoc";
import ShareQuoteForm from "~/components/ShareQuoteForm";
import { mailer } from "~/entry.server";
import { SITE_TITLE, UserContext } from "~/root";
import { db } from "~/utils/db";
import { sendEmail } from "~/utils/mailer";
import { getUserId } from "~/utils/session";
import { resTDClass, resTRClass } from "~/utils/styleClasses";
import { validateEmail } from "~/utils/validations";

type QuotesType = {
  quote_id: number;
  createdAt: string;
  updatedAt: string;
  customer: customers;
  labour: number;
  discount: number;
  quoted_products: quoted_products[];
};

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - View quote ` }];
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  const { quoteid } = params;
  const id = quoteid as string;
  try {
    const quote = await db.quotes.findUnique({
      where: {
        quote_id: parseInt(id),
      },
      include: {
        customer: true,
        quoted_products: true,
      },
    });
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

const constructEmailBody = (
  labour: FormDataEntryValue,
  discount: FormDataEntryValue,
  grandTotal: FormDataEntryValue,
  productCount: FormDataEntryValue,
  productData: any
) => {
  const pCount: number = parseInt(`${productCount}`);
  let htmlStr = `<p>Hi,<br>Please see below for your quotation:</p>`;
  htmlStr += `<p>`;
  for (let ind = 0; ind < pCount; ind++) {
    const productValue: FormDataEntryValue = productData[`prod_${ind + 1}`];
    htmlStr += `${productValue}<br>`;
  }
  htmlStr += `Labour: £${labour}<br>`;
  if (parseInt(`${discount}`) > 0) htmlStr += `Discount: £${discount}<br>`;
  htmlStr += `Total: £${grandTotal}`;
  htmlStr += `</p>`;
  htmlStr += `<p>A PDF containing your quotation is also attached for your records.</p>`;
  htmlStr += `<p>Kind Regards,<br>Smart CCTV</p>`;
  return htmlStr;
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
        labour,
        discount,
        grandTotal,
        productCount,
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
        labour,
        discount,
        grandTotal,
        productCount,
        productData
      );

      const pdfBuffer = await getQuoteBuffer(quoteid as string);

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

const prettifyDateString = (dateString: string) => {
  const date = new Date(dateString);
  return date.toDateString();
};

export default function QuoteId() {
  const user: any = useContext(UserContext);
  const { quote }: { quote: QuotesType } = useLoaderData();
  const { createdAt, discount, labour, customer, quoted_products } = quote;
  const navigation = useNavigation();
  const data = useActionData();
  const isSubmitting = navigation.state === "submitting";
  const [grandTotal, setGrandTotal] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    setGrandTotal(() => {
      let subTotals = 0;
      quoted_products.forEach(
        ({ price, quantity }) => (subTotals += price * quantity)
      );
      return subTotals + labour - discount;
    });
  }, [discount, labour, quoted_products]);

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
      <table className="table">
        <thead>
          <tr className="hidden md:table-row">
            <th>Name</th>
            <th>Quantity</th>
            <th className="text-right">Unit Price (£)</th>
            <th className="text-right">Subtotal (£)</th>
          </tr>
        </thead>
        <tbody>
          {quoted_products &&
            quoted_products.map(
              ({ invprod_id, name, quantity, price }: quoted_products) => {
                return (
                  <tr key={invprod_id} className={resTRClass}>
                    <td data-label="Name" className={resTDClass}>
                      {name}
                    </td>
                    <td data-label="Quantity" className={resTDClass}>
                      {quantity}
                    </td>
                    <td
                      data-label="Unit Price (£)"
                      className={`${resTDClass} md:text-right`}
                    >
                      {price}
                    </td>
                    <td
                      data-label="Subtotal (£)"
                      className={`${resTDClass} md:text-right`}
                    >
                      {price * quantity}
                    </td>
                  </tr>
                );
              }
            )}
          <tr className={resTRClass}>
            <td colSpan={3} className="hidden md:table-cell"></td>
            <td className="md:text-right">Labour cost (£): {labour}</td>
          </tr>
          <tr className={resTRClass}>
            <td colSpan={3} className="hidden md:table-cell"></td>
            <td className="md:text-right">Discount (£): {discount}</td>
          </tr>
          <tr className={resTRClass}>
            <td colSpan={3} className="hidden md:table-cell"></td>
            <td className="md:text-right">Total cost (£): {grandTotal}</td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-end mt-4 gap-4">
        <FormAnchorButton
          href={`/quotes/${quote.quote_id}/generatedquote`}
          target="_blank"
          rel="noreferrer"
          isSubmitting={isSubmitting}
        >
          Generate
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
