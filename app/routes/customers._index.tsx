import { PencilSquareIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import type { customers } from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import CustomerForm from "~/components/CustomerForm";
import FormAnchorButton from "~/components/FormAnchorBtn";
import FormBtn from "~/components/FormBtn";
import Modal from "~/components/Modal";
import SearchInput from "~/components/SearchInput";
import {
  createCustomer,
  getCustomerBySearch,
  getCustomers,
} from "~/controllers/customers";
import { SITE_TITLE } from "~/root";
import { getUserId } from "~/utils/session";
import { createBtnContainerClass, respTDClass, respTRClass } from "~/utils/styleClasses";
import { validateCustomerData } from "~/utils/validations";

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
  const { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "customer_search":
      const { search_term } = values;
      const customers =
        search_term.toString().length > 0
          ? await getCustomerBySearch(search_term.toString())
          : await getCustomers();
      return { customers };
    case "create":
      const createActionErrors: any = validateCustomerData(values);

      if (Object.values(createActionErrors).some(Boolean))
        return { createActionErrors };

      try {
        await createCustomer(values);
        return { customerCreated: true };
      } catch (err) {
        console.log(err);
        createActionErrors.info =
          "There was a problem creating the customer...";
        return { createActionErrors };
      }
  }
}

export default function CustomersIndex() {
  const { loadedCustomers }: any = useLoaderData();
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [customers, setCustomers] = useState(loadedCustomers);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    if (!data) return;
    if (data.customerCreated) setCreateModalOpen(false);
  }, [data]);

  return (
    <>
      <SearchInput
        _action="customer_search"
        placeholder="start typing to filter customers..."
        onDataLoaded={(fetchedData) => {
          if (fetchedData.customers) setCustomers(fetchedData.customers);
        }}
      />
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
                          <div className="absolute md:static top-0 right-3 btn-group">
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
      <div className={createBtnContainerClass}>
        <FormBtn
          isSubmitting={isSubmitting}
          onClick={() => {
            setCreateModalOpen(true);
          }}
        >
          <UserPlusIcon className="h-5 w-5 stroke-2" />
        </FormBtn>
      </div>
      <Modal open={createModalOpen}>
        <h3 className="mb-4">Create new customer</h3>
        {createModalOpen && (
          <CustomerForm
            actionName="create"
            navigation={navigation}
            formErrors={data?.createActionErrors}
            onCancel={() => {
              setCreateModalOpen(false);
              if (data) data.createActionErrors = {};
            }}
          />
        )}
      </Modal>
    </>
  );
}
