import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import Modal from "~/components/Modal";
import { SITE_TITLE } from "~/root";
import { db, deleteCustomerById } from "~/utils/db";
import { getUserId } from "~/utils/session";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Customers` }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  try {
    const customers = await db.customers.findMany();
    return json({ customers });
  } catch (err) {
    console.error(err);
    return {};
  }
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const deleteCustomerId = formData.get("customer_id") as string;
  try {
    await deleteCustomerById(parseInt(deleteCustomerId));
    return redirect("/customers");
  } catch (err) {
    console.error(err);
    return {};
  }
}

export default function CustomersIndex() {
  const TD_CLASSNAME =
    "before:content-[attr(data-label)] before:block before:mb-1 md:before:hidden";
  const { customers } = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [deletedCustomerID, setDeletedCustomerID] = useState(0);
  const [modelOpen, setModalOpen] = useState(false);
  console.log({ customers });
  return (
    <>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers &&
                customers.map((loopedCustomers: any) => {
                  return (
                    <tr
                      className="flex flex-col md:table-row"
                      key={loopedCustomers.customer_id}
                    >
                      <td data-label="ID" className={TD_CLASSNAME}>
                        {loopedCustomers.customer_id}
                      </td>
                      <td data-label="Name" className={TD_CLASSNAME}>
                        {loopedCustomers.name}
                      </td>
                      <td data-label="Tel" className={TD_CLASSNAME}>
                        {loopedCustomers.tel}
                      </td>
                      <td data-label="Email" className={TD_CLASSNAME}>
                        {loopedCustomers.email}
                      </td>
                      <td data-label="Address" className={TD_CLASSNAME}>
                        {loopedCustomers.address}
                      </td>
                      <td data-label="Actions" className={TD_CLASSNAME}>
                        <button
                          className="btn btn-neutral"
                          onClick={() => {
                            setDeletedCustomerID(loopedCustomers.customer_id);
                            setModalOpen(true);
                          }}
                        >
                          DELETE
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <a href="/customers/create" className="btn btn-neutral">
              Add new customer +
            </a>
          </div>
          <Modal open={modelOpen}>
            <p className="py-4">
              Are you sure you want to delete this customer?
            </p>
            <div className="modal-action">
              <Form
                method="post"
                onSubmit={() => {
                  setModalOpen(false);
                }}
              >
                <input
                  type="hidden"
                  name="customer_id"
                  value={deletedCustomerID}
                />
                <button
                  className="btn btn-neutral"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Confirming..." : "Confirm"}
                </button>
              </Form>
              <button
                className="btn btn-neutral"
                disabled={isSubmitting}
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
            </div>
          </Modal>
        </div>
      ) : (
        <p>No customers found...</p>
      )}
    </>
  );
}
