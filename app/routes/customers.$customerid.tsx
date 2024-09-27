import {
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Prisma } from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import CustomerForm from "~/components/CustomerForm";
import FormAnchorButton from "~/components/FormAnchorBtn";
import FormBtn from "~/components/FormBtn";
import Modal from "~/components/Modal";
import {
  deleteCustomerById,
  getCustomerById,
  updateCustomer,
} from "~/controllers/customers";
import { deleteInvoiceById } from "~/controllers/invoices";
import { deleteQuoteById } from "~/controllers/quotes";
import { SITE_TITLE } from "~/root";
import { getUserId } from "~/utils/session";
import { respTDClass, respTRClass } from "~/utils/styleClasses";
import type { CustomerType, InvoicesType, QuotesType } from "~/utils/types";
import { validateCustomerData } from "~/utils/validations";
import {
  getCurrencyString,
  getGrandTotal,
  getSubtotal,
  prettifyDateString,
} from "../utils/formatters";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - View invoice` }];
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  const { customerid } = params;
  const id = customerid as string;
  try {
    const customer = await getCustomerById(parseInt(id));
    return json({ customer });
  } catch (err) {
    console.error(err);
    return {};
  }
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  const deleteActionsErrors: any = {};
  switch (_action) {
    case "edit":
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
    case "delete_customer":
      const { customer_id } = values;
      const deleteActionsErrors: any = {};
      try {
        await deleteCustomerById(parseInt(`${customer_id}`));
        return { customerDeleted: true };
      } catch (err: any) {
        console.error(err);
        deleteActionsErrors.info = `There was a problem deleting customer with id: ${customer_id}`;
        return { deleteActionsErrors };
      }
    case "delete_quote":
      const { quote_id } = values;
      try {
        await deleteQuoteById(parseInt(`${quote_id}`));
        return { quoteDeleted: true };
      } catch (err) {
        console.error(err);
        deleteActionsErrors.info = `There was a problem deleting quote with id: ${quote_id}`;
        return { deleteActionsErrors };
      }
    case "delete_invoice":
      const { invoice_id } = values;
      try {
        await deleteInvoiceById(parseInt(`${invoice_id}`));
        return { invoiceDeleted: true };
      } catch (err) {
        console.error(err);
        deleteActionsErrors.info = `There was a problem deleting invoice with id: ${invoice_id}`;
        return { deleteActionsErrors };
      }
  }
  return {};
}

export default function InvoiceId() {
  const { customer } = useLoaderData();
  const {
    customer_id,
    name,
    tel,
    email,
    address,
    invoice: invoices,
    quote: quotes,
  }: CustomerType = customer;
  const navigation = useNavigation();
  const data = useActionData();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const [deleteQuoteId, setDeleteQuoteId] = useState(0);
  const [deleteQuoteModelOpen, setDeleteQuoteModalOpen] = useState(false);
  const [deleteInvoiceId, setDeleteInvoiceId] = useState(0);
  const [deleteInvoiceModelOpen, setDeleteInvoiceModalOpen] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState(0);
  const [deleteCustomerModelOpen, setDeleteCustomerModalOpen] = useState(false);

  useEffect(() => {
    if (!data) return;
    if (data.quoteDeleted) setDeleteQuoteModalOpen(false);
    if (data.invoiceDeleted) setDeleteInvoiceModalOpen(false);
    if (data.customerDeleted) setDeleteCustomerModalOpen(false);
  }, [data]);

  return (
    <div>
      <h2>Edit customer</h2>
      <CustomerForm
        actionName="edit"
        existingData={{ customer_id, name, tel, email, address }}
        navigation={navigation}
        formErrors={data?.editActionErrors}
      />
      <h3>Quotes</h3>
      {quotes && quotes.length ? (
        <div className="-m-4 md:m-0">
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
              {quotes &&
                quotes.map(
                  ({
                    quote_id,
                    createdAt,
                    quoted_products,
                    labour,
                    discount,
                  }: QuotesType) => {
                    return (
                      <tr className={respTRClass} key={quote_id}>
                        <td data-label="ID: " className={respTDClass}>
                          {quote_id}
                        </td>
                        <td data-label="Date: " className={respTDClass}>
                          {prettifyDateString(createdAt)}
                        </td>
                        <td
                          data-label="Customer: "
                          className={`${respTDClass} w-full`}
                        >
                          {name}
                        </td>
                        <td data-label="Amount: " className={respTDClass}>
                          {getCurrencyString(
                            getGrandTotal(
                              getSubtotal(quoted_products),
                              new Prisma.Decimal(labour),
                              new Prisma.Decimal(discount)
                            )
                          )}
                        </td>
                        <td className={respTDClass}>
                          <div className="absolute md:static top-0 right-3 btn-group">
                            <FormAnchorButton
                              isSubmitting={isSubmitting}
                              href={`/quotes/${quote_id}`}
                            >
                              <EyeIcon className="h-5 w-5 stroke-2" />
                            </FormAnchorButton>
                            <FormAnchorButton
                              isSubmitting={isSubmitting}
                              href={`/quotes/${quote_id}/edit`}
                            >
                              <PencilSquareIcon className="h-5 w-5 stroke-2" />
                            </FormAnchorButton>
                            <FormBtn
                              isSubmitting={isSubmitting}
                              onClick={() => {
                                setDeleteQuoteId(quote_id);
                                setDeleteQuoteModalOpen(true);
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
        <p>No quotes found...</p>
      )}
      <h3>Invoices</h3>
      {invoices && invoices.length ? (
        <div className="-m-4 md:m-0">
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
                    invoiced_products,
                    labour,
                    discount,
                  }: InvoicesType) => {
                    return (
                      <tr className={respTRClass} key={invoice_id}>
                        <td data-label="ID: " className={respTDClass}>
                          {invoice_id}
                        </td>
                        <td data-label="Date: " className={respTDClass}>
                          {prettifyDateString(createdAt)}
                        </td>
                        <td
                          data-label="Customer: "
                          className={`${respTDClass} w-full`}
                        >
                          {name}
                        </td>
                        <td data-label="Amount: " className={respTDClass}>
                          {getCurrencyString(
                            getGrandTotal(
                              getSubtotal(invoiced_products),
                              new Prisma.Decimal(labour),
                              new Prisma.Decimal(discount)
                            )
                          )}
                        </td>
                        <td className={respTDClass}>
                          <div className="absolute md:static top-0 right-3 btn-group">
                            <FormAnchorButton
                              isSubmitting={isSubmitting}
                              href={`/invoices/${invoice_id}`}
                            >
                              <EyeIcon className="h-5 w-5 stroke-2" />
                            </FormAnchorButton>
                            <FormAnchorButton
                              isSubmitting={isSubmitting}
                              href={`/invoices/${invoice_id}/edit`}
                            >
                              <PencilSquareIcon className="h-5 w-5 stroke-2" />
                            </FormAnchorButton>
                            <FormBtn
                              isSubmitting={isSubmitting}
                              onClick={() => {
                                setDeleteInvoiceId(invoice_id);
                                setDeleteInvoiceModalOpen(true);
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
        <p>No invoices found...</p>
      )}
      <div className="flex flex-row justify-end gap-2">
        <FormAnchorButton
          onClick={() => navigate(-1)}
          isSubmitting={isSubmitting}
        >
          <ArrowUturnLeftIcon className="h-5 w-5 stroke-2" />
        </FormAnchorButton>
        {invoices?.length === 0 && quotes?.length === 0 && (
          <FormBtn
            isSubmitting={isSubmitting}
            onClick={() => {
              setDeleteCustomerId(customer_id);
              setDeleteCustomerModalOpen(true);
            }}
          >
            <TrashIcon className="h-5 w-5 stroke-2" />
          </FormBtn>
        )}
      </div>
      <Modal open={deleteQuoteModelOpen}>
        <p>Are you sure you want to delete this quote?</p>
        {data && data.deleteActionsErrors && (
          <p className="text-error mt-1 text-xs">
            {data.deleteActionsErrors.info}
          </p>
        )}
        <div className="modal-action">
          <Form replace method="post">
            <input type="hidden" name="quote_id" value={deleteQuoteId} />
            <FormBtn
              type="submit"
              name="_action"
              value="delete_quote"
              isSubmitting={isSubmitting}
            >
              <ArrowDownTrayIcon className="h-5 w-5 stroke-2" />
            </FormBtn>
          </Form>
          <FormBtn
            className="ml-4"
            isSubmitting={isSubmitting}
            onClick={() => setDeleteQuoteModalOpen(false)}
          >
            <ArrowUturnLeftIcon className="h-5 w-5 stroke-2" />
          </FormBtn>
        </div>
      </Modal>
      <Modal open={deleteInvoiceModelOpen}>
        <p>Are you sure you want to delete this invoice?</p>
        {data && data.deleteActionsErrors && (
          <p className="text-error mt-1 text-xs">
            {data.deleteActionsErrors.info}
          </p>
        )}
        <div className="modal-action">
          <Form replace method="post">
            <input type="hidden" name="invoice_id" value={deleteInvoiceId} />
            <FormBtn
              type="submit"
              name="_action"
              value="delete_invoice"
              isSubmitting={isSubmitting}
            >
              <ArrowDownTrayIcon className="h-5 w-5 stroke-2" />
            </FormBtn>
          </Form>
          <FormBtn
            className="ml-4"
            isSubmitting={isSubmitting}
            onClick={() => setDeleteInvoiceModalOpen(false)}
          >
            <ArrowUturnLeftIcon className="h-5 w-5 stroke-2" />
          </FormBtn>
        </div>
      </Modal>
      <Modal open={deleteCustomerModelOpen}>
        <p>Are you sure you want to delete this customer?</p>
        {data && data.deleteActionsErrors && (
          <p className="text-error mt-1 text-xs">
            {data.deleteActionsErrors.info}
          </p>
        )}
        <div className="modal-action">
          <Form replace method="post">
            <input type="hidden" name="customer_id" value={deleteCustomerId} />
            <FormBtn
              type="submit"
              name="_action"
              value="delete_customer"
              isSubmitting={isSubmitting}
            >
              <ArrowDownTrayIcon className="h-5 w-5 stroke-2" />
            </FormBtn>
          </Form>
          <FormBtn
            className="ml-4"
            isSubmitting={isSubmitting}
            onClick={() => setDeleteCustomerModalOpen(false)}
          >
            <ArrowUturnLeftIcon className="h-5 w-5 stroke-2" />
          </FormBtn>
        </div>
      </Modal>
    </div>
  );
}
