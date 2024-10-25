import { PencilSquareIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import type { customers } from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import AlertMessage from "~/components/AlertMessage";
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
import { error } from "~/utils/errors";
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
    const { customerCount } = await getCustomersCount();
    return { customerCount };
  } catch (error) {
    return { error };
  }
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "get_paged_customers":
      try {
        const { pagedCustomers } = await getCustomers(values);
        return { pagedCustomers };
      } catch (error) {
        return { error };
      }
    case "customers_search":
      try {
        const { customers } = await getCustomersBySearch(values);
        return { customers };
      } catch (error) {
        return { error };
      }
    case "create":
      try {
        const createdCustomerData = await createCustomer(values);
        return { createdCustomerData };
      } catch (error) {
        return { error };
      }
  }
  return {
    error: { code: 400, message: "Bad request: action was not handled" },
  };
}

export default function CustomersIndex() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [customerCount, setCustomerCount] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [activeMenuItemId, setActiveMenuItemId] = useState(0);
  const [alertData, setAlertData] = useState<error | null>(null);

  useEffect(() => {
    if (!loaderData) return;
    const { customerCount: retrievedCustomerCount } = loaderData;
    if (retrievedCustomerCount) setCustomerCount(retrievedCustomerCount);
    if (loaderData.error) setAlertData(loaderData.error);
  }, [loaderData]);

  useEffect(() => {
    if (!actionData) return;
    const { createdCustomerData, error } = actionData;
    if (createdCustomerData) {
      const { code } = createdCustomerData;
      setCustomerCount((oldCustomerCount: number) => oldCustomerCount + 1);
      setCreateModalOpen(false);
      // alert
      setAlertData({ code, message: `Success: customer created` });
    }
    if (error) setAlertData(error);
  }, [actionData]);

  return (
    <>
      <SearchInput
        _action="customers_search"
        placeholder="start typing to filter customers..."
        onDataLoaded={({ customers: retrievedCustomers, error }) => {
          if (retrievedCustomers) {
            const isRetrievedCustomers = retrievedCustomers.length > 0;
            setIsSearched(isRetrievedCustomers);
            if (isRetrievedCustomers) setCustomers(retrievedCustomers);
          }
          if (error) setAlertData(error);
        }}
      />
      <div className="-m-4 md:mb-0 md:mx-0">
        <table className="table">
          {customers && customers.length ? (
            <>
              <thead>
                <tr className="hidden md:table-row">
                  <th className="w-1/5">Name</th>
                  <th className="w-1/5">Tel</th>
                  <th className="w-1/5">Email</th>
                  <th className="w-1/5">Address</th>
                  <th className="text-right w-1/5">Actions</th>
                </tr>
              </thead>
              <tbody className="border-y border-base-content/20">
                {customers &&
                  customers.map(
                    ({ customer_id, name, tel, email, address }: customers) => (
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
                    )
                  )}
              </tbody>
            </>
          ) : (
            <tbody className="border-y border-base-content/20">
              <tr className={respTRClass}>
                <td className={respTDClass}>No customers found...</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
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
            onCancel={() => {
              setCreateModalOpen(false);
              if (actionData) actionData.createActionErrors = {};
            }}
          />
        )}
      </Modal>
      <AlertMessage alertData={alertData} setAlertData={setAlertData} />
    </>
  );
}
