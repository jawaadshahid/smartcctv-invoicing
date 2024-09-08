import {
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import type { customers } from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import FormAnchorButton from "~/components/FormAnchorBtn";
import FormBtn from "~/components/FormBtn";
import Modal from "~/components/Modal";
import { deleteCustomerById, getCustomers } from "~/controllers/customers";
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

const deleteCustomerAction = async (values: any) => {
  const { customer_id } = values;
  const deleteActionsErrors: any = {};
  try {
    await deleteCustomerById(parseInt(`${customer_id}`));
    return { customerDeleted: true };
  } catch (err: any) {
    console.log(err);
    if (err.code === "P2003")
      deleteActionsErrors.info = `Cannot delete. This customer is associated with a quote!`;
    else deleteActionsErrors.info = `There was a problem deleting customer`;
    return { deleteActionsErrors };
  }
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "delete":
      return await deleteCustomerAction(values);
  }
  return {};
}

export default function CustomersIndex() {
  const { customers }: { customers: customers[] } = useLoaderData();
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [deletedCustomerID, setDeletedCustomerID] = useState(0);
  const [deleteModelOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!data) return;
    if (data.customerDeleted) setDeleteModalOpen(false);
  }, [data]);

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
                            <FormBtn
                              isSubmitting={isSubmitting}
                              onClick={() => {
                                setDeletedCustomerID(customer_id);
                                setDeleteModalOpen(true);
                              }}
                            >
                              <TrashIcon className="h-5 w-5 stroke-2" />
                            </FormBtn>
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
      <Modal open={deleteModelOpen}>
        <p>Are you sure you want to delete this customer?</p>
        {data && data.deleteActionsErrors && (
          <p className="text-error mt-1 text-xs">
            {data.deleteActionsErrors.info}
          </p>
        )}
        <div className="modal-action">
          <Form replace method="post">
            <input type="hidden" name="customer_id" value={deletedCustomerID} />
            <FormBtn
              type="submit"
              name="_action"
              value="delete"
              isSubmitting={isSubmitting}
            >
              <ArrowDownTrayIcon className="h-5 w-5 stroke-2" />
            </FormBtn>
          </Form>
          <FormBtn
            className="ml-4"
            isSubmitting={isSubmitting}
            onClick={() => setDeleteModalOpen(false)}
          >
            <ArrowUturnLeftIcon className="h-5 w-5 stroke-2" />
          </FormBtn>
        </div>
      </Modal>
    </>
  );
}
