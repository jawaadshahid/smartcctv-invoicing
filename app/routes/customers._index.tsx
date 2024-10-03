import { PencilSquareIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import type { customers } from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import CustomerForm from "~/components/CustomerForm";
import FormAnchorButton from "~/components/FormAnchorBtn";
import FormBtn from "~/components/FormBtn";
import ListingItemMenu from "~/components/ListingItemMenu";
import Modal from "~/components/Modal";
import Pagination from "~/components/Pagination";
import SearchInput from "~/components/SearchInput";
import {
  createCustomer,
  getCustomers,
  getCustomersBySearch,
  getCustomersCount,
} from "~/controllers/customers";
import { SITE_TITLE } from "~/root";
import { getUserId } from "~/utils/session";
import {
  createBtnContainerClass,
  respMidTDClass,
  respTDClass,
  respTRClass,
} from "~/utils/styleClasses";
import { validateCustomerData } from "~/utils/validations";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Customers` }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  try {
    const customerCount = await getCustomersCount();
    return json({ customerCount });
  } catch (err) {
    console.error(err);
    return {};
  }
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "get_paged_customers":
      const { skip, take } = values;
      const pagedCustomers = await getCustomers(
        parseInt(skip.toString()),
        parseInt(take.toString())
      );
      return { pagedCustomers };
    case "customers_search":
      const { search_term } = values;
      const customers =
        search_term.toString().length > 0
          ? await getCustomersBySearch(search_term.toString())
          : [];
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
  const { customerCount }: any = useLoaderData();
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [customers, setCustomers] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [activeMenuItemId, setActiveMenuItemId] = useState(0);

  useEffect(() => {
    if (!data) return;
    if (data.customerCreated) setCreateModalOpen(false);
  }, [data]);

  return (
    <>
      <SearchInput
        _action="customers_search"
        placeholder="start typing to filter customers..."
        onDataLoaded={(fetchedData) => {
          if (fetchedData.customers) {
            setCustomers(fetchedData.customers);
            setIsSearched(fetchedData.customers.length > 0);
          }
        }}
      />
      {customers && customers.length ? (
        <div className="-m-4 md:m-0">
          <table className="table">
            <thead>
              <tr className="hidden md:table-row">
                <th className="w-1/5">Name</th>
                <th className="w-1/5">Tel</th>
                <th className="w-1/5">Email</th>
                <th className="w-1/5">Address</th>
                <th className="text-right w-1/5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers &&
                customers.map(
                  ({ customer_id, name, tel, email, address }: customers) => {
                    return (
                      <tr className={respTRClass} key={customer_id}>
                        <td data-label="Name: " className={respMidTDClass}>
                          {name}
                        </td>
                        <td data-label="Tel: " className={respMidTDClass}>
                          {tel}
                        </td>
                        <td data-label="Email: " className={respMidTDClass}>
                          {email}
                        </td>
                        <td data-label="Address: " className={respTDClass}>
                          {address}
                        </td>
                        <td className={`${respTDClass} md:text-right`}>
                          <ListingItemMenu
                            isOpen={customer_id === activeMenuItemId}
                            setIsOpen={(isOpen) =>
                              setActiveMenuItemId(isOpen ? customer_id : 0)
                            }
                          >
                            <FormAnchorButton
                              isSubmitting={isSubmitting}
                              href={`customers/${customer_id}`}
                            >
                              <PencilSquareIcon className="h-5 w-5 stroke-2" />
                            </FormAnchorButton>
                          </ListingItemMenu>
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
        {!isSearched && (
          <Pagination
            className="mr-4"
            totalCount={customerCount}
            _action="get_paged_customers"
            onDataLoaded={({ pagedCustomers }) => {
              if (pagedCustomers) setCustomers(pagedCustomers);
            }}
          />
        )}
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
