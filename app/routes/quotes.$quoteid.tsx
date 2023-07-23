import type { customers, quoted_products } from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
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

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "share_quote":
      const { quoteid, customerEmail, userEmail, otherEmails } = values;
      const shareActionErrors: any = {};

      if (!customerEmail && !userEmail && !otherEmails)
        shareActionErrors.msg = "One option has to be selected or defined!";

      if (Object.values(shareActionErrors).some(Boolean))
        return { shareActionErrors };

      const othEmails = otherEmails
        ? String(otherEmails)
            .split(",")
            .map((othEmail: string) => {
              const trimmed = othEmail.trim();
              shareActionErrors.msg = validateEmail(trimmed);
              return trimmed;
            })
        : [];

      if (Object.values(shareActionErrors).some(Boolean))
        return { shareActionErrors };

      const allEmails: string[] = [...othEmails];

      if (customerEmail) allEmails.push(String(customerEmail));
      if (userEmail) allEmails.push(String(userEmail));

      const pdfBuffer = await getQuoteBuffer(quoteid as string);

      const mailResponse: any = await sendEmail(allEmails, pdfBuffer);
      if (mailResponse.error)
        return { shareActionErrors: { msg: mailResponse.error } };
      if (process.env.NODE_ENV === "development") {
        console.log("message sent:", mailer.getTestMessageUrl(mailResponse));
      }

      if (mailResponse.accepted && mailResponse.accepted.length > 0)
        return { shareActionErrors: { msg: "mail sent!" } };
      return {
        shareActionErrors: {
          msg: "something went wrong (vague, I know, but I haven't handled this error)",
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
  const { createdAt, labour, customer, quoted_products } = quote;
  const navigation = useNavigation();
  const data = useActionData();
  const [grandTotal, setGrandTotal] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    setGrandTotal(() => {
      let subTotals = 0;
      quoted_products.forEach(
        ({ price, quantity }) => (subTotals += price * quantity)
      );
      return subTotals + labour;
    });
  }, [labour, quoted_products]);

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
            <td className="md:text-right">Total cost (£): {grandTotal}</td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-end mt-4 gap-4">
        <a
          href={`/quotes/${quote.quote_id}/generatedquote`}
          target="_blank"
          className="btn"
          rel="noreferrer"
        >
          Generate
        </a>
        <button
          className="btn"
          onClick={() => {
            setShowShareModal(true);
          }}
        >
          Share
        </button>
        <a href="/quotes" className="btn">
          Back
        </a>
      </div>
      <Modal open={showShareModal}>
        <h3 className="mb-4">Share with:</h3>
        {showShareModal && (
          <ShareQuoteForm
            quoteid={quote.quote_id}
            customer={customer}
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
