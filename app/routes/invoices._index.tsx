import { Prisma } from "@prisma/client";
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
import { deleteInvoiceById, getInvoices } from "~/controllers/invoices";
import { SITE_TITLE } from "~/root";
import { getUserId } from "~/utils/session";
import {
  createBtnContainerClass,
  respTDClass,
  respTRClass,
} from "~/utils/styleClasses";
import type { InvoicesType } from "~/utils/types";
import {
  getCurrencyString,
  getGrandTotal,
  getSubtotal,
  prettifyDateString,
} from "../utils/formatters";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Invoices` }];
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "delete":
      const { invoice_id } = values;
      const deleteActionsErrors: any = {};
      try {
        await deleteInvoiceById(parseInt(`${invoice_id}`));
        return { invoiceDeleted: true };
      } catch (err) {
        console.error(err);
        deleteActionsErrors.info = `There was a problem deleting invoice with id: ${invoice_id}`;
        return { deleteActionsErrors };
      }
  }
}

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  try {
    const invoices = await getInvoices();
    return json({ invoices });
  } catch (err) {
    console.error(err);
    return {};
  }
};

export default function InvoicesIndex() {
  const { quotes: invoices }: { quotes: InvoicesType[] | any[] } =
    useLoaderData();
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [deletedInvoiceId, setDeletedInvoiceId] = useState(0);
  const [deleteModelOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!data) return;
    if (data.invoiceDeleted) setDeleteModalOpen(false);
  }, [data]);

  return (
    <>
      {invoices && invoices.length ? (
        <div className="-mx-4 md:mx-0">
          <table className="table">
            <thead>
              <tr className="hidden md:table-row">
                <th>ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices &&
                invoices.map(
                  ({
                    invoice_id,
                    createdAt,
                    customer,
                    invoiced_products,
                    labour,
                    discount,
                  }: InvoicesType) => {
                    return (
                      <tr className={respTRClass} key={invoice_id}>
                        <td data-label="ID" className={respTDClass}>
                          {invoice_id}
                        </td>
                        <td data-label="Date" className={respTDClass}>
                          {prettifyDateString(createdAt)}
                        </td>
                        <td data-label="Customer" className={respTDClass}>
                          {customer.name}
                        </td>
                        <td data-label="Amount" className={respTDClass}>
                          {getCurrencyString(
                            getGrandTotal(
                              getSubtotal(invoiced_products),
                              new Prisma.Decimal(labour),
                              new Prisma.Decimal(discount)
                            )
                          )}
                        </td>
                        <td data-label="Actions" className={respTDClass}>
                          <div className="btn-group">
                            <FormAnchorButton
                              isSubmitting={isSubmitting}
                              href={`quotes/${invoice_id}`}
                            >
                              View
                            </FormAnchorButton>
                            <FormAnchorButton
                              isSubmitting={isSubmitting}
                              href={`quotes/${invoice_id}/edit`}
                            >
                              Edit
                            </FormAnchorButton>
                            <FormBtn
                              isSubmitting={isSubmitting}
                              onClick={() => {
                                setDeletedInvoiceId(invoice_id);
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
        <p>No invoices found...</p>
      )}
      <div className={createBtnContainerClass}>
        <FormAnchorButton href="/invoices/create">
          Add new invoices +
        </FormAnchorButton>
      </div>
      <Modal open={deleteModelOpen}>
        <p>Are you sure you want to delete this invoice?</p>
        {data && data.deleteActionsErrors && (
          <p className="text-error mt-1 text-xs">
            {data.deleteActionsErrors.info}
          </p>
        )}
        <div className="modal-action">
          <Form replace method="post">
            <input type="hidden" name="invoice_id" value={deletedInvoiceId} />
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
    </>
  );
}
