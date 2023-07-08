import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db";
import { getUserId } from "~/utils/session";

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  try {
    const customers = db.customers.findMany();
    return json({ customers });
  } catch (err) {
    console.error(err);
    return {};
  }
};

export default function CustomersIndex() {
  const TD_CLASSNAME =
    "before:content-[attr(data-label)] before:block before:mb-1 md:before:hidden";
  const { customers } = useLoaderData();
  console.log({ customers });
  return (
    <>
      {customers && customers.length ? (
        <div className="-mx-4">
          <table className="table static">
            <thead>
              <tr className="hidden md:table-row">
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {customers &&
                customers.map((loopedCustomers: any) => {
                  return (
                    <tr
                      className="flex flex-col md:table-row"
                      key={loopedCustomers.id}
                    >
                      <td data-label="ID" className={TD_CLASSNAME}>
                        {loopedCustomers.id}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No customers found...</p>
      )}
      <div className="flex justify-end">
        <a href="#" className="btn btn-neutral">
          Add new customer +
        </a>
      </div>
    </>
  );
}
