import type { customers, quoted_products } from "@prisma/client";
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { SITE_TITLE } from "~/root";
import { db } from "~/utils/db";
import { getUserId } from "~/utils/session";
import { resTDClass, resTRClass } from "~/utils/styleClasses";

type QuotesType = {
  quote_id: number;
  createdAt: string;
  updatedAt: string;
  customer: customers;
  labour: number;
  quoted_products: quoted_products[];
};

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Quotes` }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  try {
    const quotes = await db.quotes.findMany({
      include: {
        customer: true,
        quoted_products: true,
      },
    });
    return json({ quotes });
  } catch (err) {
    console.error(err);
    return {};
  }
};

const prettifyDateString = (dateString: string) => {
  const date = new Date(dateString);
  return date.toDateString();
};

export default function QuotesIndex() {
  const { quotes } = useLoaderData();

  return (
    <>
      {quotes && quotes.length ? (
        <table className="table static">
          <thead>
            <tr className="hidden md:table-row">
              <th>ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Amount (£)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotes &&
              quotes.map(
                ({
                  quote_id,
                  createdAt,
                  customer,
                  quoted_products,
                  labour,
                }: QuotesType) => {
                  return (
                    <tr className={resTRClass} key={quote_id}>
                      <td data-label="ID" className={resTDClass}>
                        {quote_id}
                      </td>
                      <td data-label="Date" className={resTDClass}>
                        {prettifyDateString(createdAt)}
                      </td>
                      <td data-label="Customer" className={resTDClass}>
                        {customer.name}
                      </td>
                      <td data-label="Amount (£)" className={resTDClass}>
                        {quoted_products.reduce(
                          (partialSum, qp) =>
                            partialSum + qp.price * qp.quantity,
                          0
                        ) + labour}
                      </td>
                      <td data-label="Actions" className={resTDClass}>
                        <div className="btn-group">
                          <a
                            href={`quotes/${quote_id}`}
                            className="btn"
                          >
                            View
                          </a>
                          <button className="btn">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
          </tbody>
        </table>
      ) : (
        <p>No quotes found...</p>
      )}
      <div className="flex justify-end mt-4">
        <a href="/quotes/create" className="btn">
          Add new quote +
        </a>
      </div>
    </>
  );
}
