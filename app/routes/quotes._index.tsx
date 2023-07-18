import type { quoted_products, quotes } from "@prisma/client";
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { SITE_TITLE } from "~/root";
import { db } from "~/utils/db";
import { getUserId } from "~/utils/session";

interface QuotesType extends quotes {
  quoted_products: quoted_products[];
}

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Quotes` }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  try {
    const quotes = await db.quotes.findMany({
      include: {
        quoted_products: true,
      },
    });
    return json({ quotes });
  } catch (err) {
    console.error(err);
    return {};
  }
};

export default function QuotesIndex() {
  const TD_CLASSNAME =
    "before:content-[attr(data-label)] before:block before:mb-1 md:before:hidden";
  const { quotes } = useLoaderData();
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
                    c_name,
                    quoted_products,
                    labour,
                  }: QuotesType) => {
                    return (
                      <tr className="flex flex-col md:table-row" key={quote_id}>
                        <td data-label="ID" className={TD_CLASSNAME}>
                          {quote_id}
                        </td>
                        <td data-label="Date" className={TD_CLASSNAME}>
                          {createdAt.toISOString()}
                        </td>
                        <td data-label="Customer" className={TD_CLASSNAME}>
                          {c_name}
                        </td>
                        <td data-label="Amount (£)" className={TD_CLASSNAME}>
                          {quoted_products.reduce(
                            (partialSum, qp) =>
                              qp.price * qp.quantity + partialSum,
                            0
                          ) + labour}
                        </td>
                        <td data-label="Actions" className={TD_CLASSNAME}>
                          view, share, delete
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
