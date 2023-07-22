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
import CreateCustomerForm from "~/components/CreateCustomerForm";
import Modal from "~/components/Modal";
import { SITE_TITLE } from "~/root";
import { createCustomer, db, deleteCustomerById } from "~/utils/db";
import { getUserId } from "~/utils/session";
import { resTDClass, resTRClass } from "~/utils/styleClasses";
import { validateCustomerData } from "~/utils/validations";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Customers` }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  try {
    const customers: customers[] = await db.customers.findMany();
    return json({ customers });
  } catch (err) {
    console.error(err);
    return {};
  }
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "delete":
      const { customer_id } = values;
      const deleteActionsErrors: any = {};
      try {
        await deleteCustomerById(parseInt(`${customer_id}`));
        return { customerDeleted: true };
      } catch (err) {
        console.error(err);
        deleteActionsErrors.info = `There was a problem deleting customer with id: ${customer_id}`;
        return { deleteActionsErrors };
      }
    case "create":
      const { name, tel, email, address } = values;
      const createActionErrors: any = validateCustomerData(values);

      if (Object.values(createActionErrors).some(Boolean))
        return { createActionErrors };

      try {
        await createCustomer(`${name}`, `${tel}`, `${email}`, `${address}`)
        return { customerCreated: true };
      } catch (err) {
        console.log(err);
        createActionErrors.info =
          "There was a problem creating the customer...";
        return { createActionErrors };
      }
  }
  return {};
}

export default function Customers() {
  const { customers }: { customers: customers[] } = useLoaderData();
  const data = useActionData();
  const navigation = useNavigation();
  const [deletedCustomerID, setDeletedCustomerID] = useState(0);
  const [deleteModelOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    if (!data) return;
    if (data.customerCreated) setCreateModalOpen(false);
    if (data.customerDeleted) setDeleteModalOpen(false);
  }, [data]);

  return (
    <div className="md:container md:mx-auto p-6">
      {customers && customers.length ? (
        <div className="-mx-4">
          <table className="table static">
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
                      <tr
                        className={resTRClass}
                        key={customer_id}
                      >
                        <td data-label="ID" className={resTDClass}>
                          {customer_id}
                        </td>
                        <td data-label="Name" className={resTDClass}>
                          {name}
                        </td>
                        <td data-label="Tel" className={resTDClass}>
                          {tel}
                        </td>
                        <td data-label="Email" className={resTDClass}>
                          {email}
                        </td>
                        <td data-label="Address" className={resTDClass}>
                          {address}
                        </td>
                        <td
                          data-label="Actions"
                          className={`${resTDClass} md:text-right`}
                        >
                          <button
                            className="btn btn-neutral"
                            onClick={() => {
                              setDeletedCustomerID(customer_id);
                              setDeleteModalOpen(true);
                            }}
                          >
                            DELETE
                          </button>
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
      <div className="flex justify-end mt-4">
        <button
          className="btn btn-neutral"
          onClick={() => {
            setCreateModalOpen(true);
          }}
        >
          Add new customer +
        </button>
      </div>
      <Modal open={createModalOpen}>
        <h3 className="mb-4">Create new customer</h3>
        {createModalOpen && (
          <CreateCustomerForm
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
      <Modal open={deleteModelOpen}>
        <p className="py-4">Are you sure you want to delete this customer?</p>
        {data && data.deleteActionsErrors && (
          <p className="text-error mt-1 text-xs">
            {data.deleteActionsErrors.info}
          </p>
        )}
        <div className="modal-action">
          <Form replace method="post">
            <input type="hidden" name="customer_id" value={deletedCustomerID} />
            <button
              className="btn btn-neutral"
              type="submit"
              name="_action"
              value="delete"
              disabled={navigation.state === "submitting"}
            >
              {navigation.state === "submitting" ? "Confirming..." : "Confirm"}
            </button>
          </Form>
          <button
            className="btn btn-neutral"
            disabled={navigation.state === "submitting"}
            onClick={() => setDeleteModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
