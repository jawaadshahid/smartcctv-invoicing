import { PencilSquareIcon } from "@heroicons/react/24/outline";
import type { customers } from "@prisma/client";
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import FormAnchorButton from "~/components/FormAnchorBtn";
import { getCustomers } from "~/controllers/customers";
import { SITE_TITLE } from "~/root";
import { getUserId } from "~/utils/session";
import { respTDClass, respTRClass } from "~/utils/styleClasses";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Customers` }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  try {
    const customers = await getCustomers();
    return json({ customers });
  } catch (err) {
    console.error(err);
    return {};
  }
};

export default function CustomersIndex() {
  const { customers }: { customers: customers[] } = useLoaderData();
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <>
      {customers && customers.length ? (
        <div className="-m-4 md:m-0">
          <table className="table">
            <thead>
              <tr className="hidden md:table-row">
                <th>ID</th>
                <th>Name</th>
                <th>Tel</th>
                <th>Email</th>
                <th>Address</th>
                <th className="md:text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers &&
                customers.map(
                  ({ customer_id, name, tel, email, address }: customers) => {
                    return (
                      <tr className={respTRClass} key={customer_id}>
                        <td data-label="ID: " className={respTDClass}>
                          {customer_id}
                        </td>
                        <td
                          data-label="Name: "
                          className={`${respTDClass} w-half`}
                        >
                          {name}
                        </td>
                        <td data-label="Tel: " className={respTDClass}>
                          {tel}
                        </td>
                        <td data-label="Email: " className={respTDClass}>
                          {email}
                        </td>
                        <td
                          data-label="Address: "
                          className={`${respTDClass} w-half`}
                        >
                          {address}
                        </td>
                        <td className={`${respTDClass} md:text-right`}>
                          <div className="absolute md:static top-0 right-0 btn-group">
                            <FormAnchorButton
                              isSubmitting={isSubmitting}
                              href={`customers/${customer_id}`}
                            >
                              <PencilSquareIcon className="h-5 w-5 stroke-2" />
                            </FormAnchorButton>
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
        <p className="text-center">No customers found...</p>
      )}
    </>
  );
}
