import type { customers, quoted_products } from "@prisma/client";
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
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
  return [{ title: `${SITE_TITLE} - View Quote ` }];
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

const prettifyDateString = (dateString: string) => {
  const date = new Date(dateString);
  return date.toDateString();
};

export default function QuoteId() {
  const TD_CLASSNAME =
    "before:content-[attr(data-label)] before:block before:mb-1 md:before:hidden";
  const { quote }: { quote: QuotesType } = useLoaderData();
  const { createdAt, labour, customer, quoted_products } = quote;
  const [grandTotal, setGrandTotal] = useState(0);

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
      <p>Generated on: {prettifyDateString(createdAt)}</p>
      <h3>Customer</h3>
      <p>Name: {customer.name}</p>
      <p>Address: {customer.address}</p>
      <p>Tel: {customer.tel}</p>
      <p>Email: {customer.email}</p>
      <h3>Products</h3>
      <div className="-mx-4">
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
                    <tr key={invprod_id} className="flex flex-col md:table-row">
                      <td data-label="Name" className={TD_CLASSNAME}>
                        {name}
                      </td>
                      <td data-label="Quantity" className={TD_CLASSNAME}>
                        {quantity}
                      </td>
                      <td
                        data-label="Unit Price (£)"
                        className={`${TD_CLASSNAME} md:text-right`}
                      >
                        {price}
                      </td>
                      <td
                        data-label="Subtotal (£)"
                        className={`${TD_CLASSNAME} md:text-right`}
                      >
                        {price * quantity}
                      </td>
                    </tr>
                  );
                }
              )}
            <tr className="flex flex-col md:table-row">
              <td colSpan={3} className="hidden md:table-cell"></td>
              <td className="md:text-right">Labour cost (£): {labour}</td>
            </tr>
            <tr className="flex flex-col md:table-row">
              <td colSpan={3} className="hidden md:table-cell"></td>
              <td className="md:text-right">Total cost (£): {grandTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4">
        <a href="/quotes" className="btn btn-neutral">
          Back
        </a>
      </div>
    </div>
  );
}
