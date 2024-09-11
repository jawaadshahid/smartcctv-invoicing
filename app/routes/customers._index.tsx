import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import type { customers } from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import FormAnchorButton from "~/components/FormAnchorBtn";
import { getCustomerBySearch, getCustomers } from "~/controllers/customers";
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
    const loadedCustomers = await getCustomers();
    return json({ loadedCustomers });
  } catch (err) {
    console.error(err);
    return {};
  }
};
export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { search_term } = Object.fromEntries(formData);
  const customers = await getCustomerBySearch(`${search_term}`);
  return { customers };
}

export default function CustomersIndex() {
  const fetcher = useFetcher();
  const navigation = useNavigation();
  const { loadedCustomers }: any = useLoaderData();
  const [customers, setCustomers] = useState(loadedCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [doingTermSearch, setDoingTermSearch] = useState(false);

  useEffect(() => {
    // return if
    setDoingTermSearch(true);
    const termSearchTimeout = setTimeout(() => {
      fetcher.submit({ search_term: searchTerm }, { method: "post" });
    }, 600);
    return () => clearTimeout(termSearchTimeout);
  }, [searchTerm]);

  useEffect(() => {
    setDoingTermSearch(false);
    if (!fetcher.data) return;
    if (fetcher.data.customers) {
      setCustomers(fetcher.data.customers);
    }
  }, [fetcher.data]);

  const isSubmitting = navigation.state === "submitting";

  return (
    <>
      <label className="input input-bordered flex items-center gap-2">
        <input
          type="text"
          className="grow bg-transparent focus:outline-0"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {doingTermSearch ? (
          <a className="btn btn-ghost btn-square loading w-5" />
        ) : (
          <MagnifyingGlassIcon className="h-5 w-5 opacity-70" />
        )}
      </label>
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
