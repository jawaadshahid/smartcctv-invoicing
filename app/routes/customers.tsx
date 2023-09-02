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
import CustomerForm from "~/components/CustomerForm";
import FormBtn from "~/components/FormBtn";
import Modal from "~/components/Modal";
import { SITE_TITLE } from "~/root";
import {
  createCustomer,
  deleteCustomerById,
  getCustomers,
  updateCustomer,
} from "~/utils/db";
import { getUserId } from "~/utils/session";
import {
  contentBodyClass,
  createBtnContainerClass,
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

const createCustomerAction = async (values: any) => {
  const createActionErrors: any = validateCustomerData(values);

  if (Object.values(createActionErrors).some(Boolean))
    return { createActionErrors };

  try {
    await createCustomer(values);
    return { customerCreated: true };
  } catch (err) {
    console.log(err);
    createActionErrors.info = "There was a problem creating the customer...";
    return { createActionErrors };
  }
};

const editCustomerAction = async (values: any) => {
  const editActionErrors: any = validateCustomerData(values);

  if (Object.values(editActionErrors).some(Boolean))
    return { editActionErrors };

  try {
    await updateCustomer(values);
    return { customerEdited: true };
  } catch (error: any) {
    console.log({ error });
    if (error.code) {
      editActionErrors.info = error.msg;
    } else
      editActionErrors.info = "There was a problem editing the customer...";
    return { editActionErrors };
  }
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "delete":
      return await deleteCustomerAction(values);
    case "create":
      return await createCustomerAction(values);
    case "edit":
      return await editCustomerAction(values);
  }
  return {};
}

export default function Customers() {
  const { customers }: { customers: customers[] } = useLoaderData();
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [deletedCustomerID, setDeletedCustomerID] = useState(0);
  const [customerToEdit, setCustomerToEdit] = useState({
    customer_id: 0,
    name: "",
    tel: "",
    email: "",
    address: "",
  });
  const [deleteModelOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    if (!data) return;
    if (data.customerCreated) setCreateModalOpen(false);
    if (data.customerDeleted) setDeleteModalOpen(false);
    if (data.customerEdited) setEditModalOpen(false);
  }, [data]);

  return (
    <div className={contentBodyClass}>
      {customers && customers.length ? (
        <div className="-mx-4 md:mx-0">
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
                        <td data-label="ID" className={respTDClass}>
                          {customer_id}
                        </td>
                        <td data-label="Name" className={respTDClass}>
                          {name}
                        </td>
                        <td data-label="Tel" className={respTDClass}>
                          {tel}
                        </td>
                        <td data-label="Email" className={respTDClass}>
                          {email}
                        </td>
                        <td data-label="Address" className={respTDClass}>
                          {address}
                        </td>
                        <td
                          data-label="Actions"
                          className={`${respTDClass} md:text-right`}
                        >
                          <div className="btn-group">
                            <FormBtn
                              isSubmitting={isSubmitting}
                              onClick={() => {
                                setCustomerToEdit({
                                  customer_id,
                                  name,
                                  tel,
                                  email,
                                  address,
                                });
                                setEditModalOpen(true);
                              }}
                            >
                              EDIT
                            </FormBtn>
                            <FormBtn
                              isSubmitting={isSubmitting}
                              onClick={() => {
                                setDeletedCustomerID(customer_id);
                                setDeleteModalOpen(true);
                              }}
                            >
                              DELETE
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
      <div className={createBtnContainerClass}>
        <FormBtn
          isSubmitting={isSubmitting}
          onClick={() => {
            setCreateModalOpen(true);
          }}
        >
          Add new customer +
        </FormBtn>
      </div>
      <Modal open={editModalOpen}>
        <h3 className="mb-4">Edit customer</h3>
        {editModalOpen && (
          <CustomerForm
            actionName="edit"
            existingData={customerToEdit}
            navigation={navigation}
            formErrors={data?.editActionErrors}
            onCancel={() => {
              setEditModalOpen(false);
              if (data) data.editActionErrors = {};
            }}
          />
        )}
      </Modal>
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
              Confirm
            </FormBtn>
          </Form>
          <FormBtn
            className="ml-4"
            isSubmitting={isSubmitting}
            onClick={() => setDeleteModalOpen(false)}
          >
            Cancel
          </FormBtn>
        </div>
      </Modal>
    </div>
  );
}
