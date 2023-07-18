import type { customers, quoted_products } from "@prisma/client";
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { SITE_TITLE } from "~/root";
import { db } from "~/utils/db";
import { getUserId } from "~/utils/session";

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
  const TD_CLASSNAME =
    "before:content-[attr(data-label)] before:block before:mb-1 md:before:hidden";
  const { quotes } = useLoaderData();

  console.log({ quotes });
  return (
    <>
      {quotes && quotes.length ? (
        <div className="-mx-4">
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
                      <tr className="flex flex-col md:table-row" key={quote_id}>
                        <td data-label="ID" className={TD_CLASSNAME}>
                          {quote_id}
                        </td>
                        <td data-label="Date" className={TD_CLASSNAME}>
                          {prettifyDateString(createdAt)}
                        </td>
                        <td data-label="Customer" className={TD_CLASSNAME}>
                          {customer.name}
                        </td>
                        <td data-label="Amount (£)" className={TD_CLASSNAME}>
                          {quoted_products.reduce(
                            (partialSum, qp) =>
                              partialSum + qp.price * qp.quantity,
                            0
                          ) + labour}
                        </td>
                        <td data-label="Actions" className={TD_CLASSNAME}>
                          <div className="join">
                            <a
                              href={`quotes/${quote_id}`}
                              className="btn btn-neutral join-item"
                            >
                              View
                            </a>
                            <button className="btn btn-neutral join-item">
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
        </div>
      ) : (
        <p>No quotes found...</p>
      )}
      <div className="flex justify-end mt-4">
        <a href="/quotes/create" className="btn btn-neutral">
          Add new quote +
        </a>
      </div>
    </>
  );
}
