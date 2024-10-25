import {
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Prisma } from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import AlertMessage from "~/components/AlertMessage";
import CustomerForm from "~/components/CustomerForm";
import FormAnchorButton from "~/components/FormAnchorBtn";
import FormBtn from "~/components/FormBtn";
import ListingItemMenu from "~/components/ListingItemMenu";
import Modal from "~/components/Modal";
import {
  deleteCustomerById,
  getCustomerById,
  updateCustomer,
} from "~/controllers/customers";
import { deleteInvoiceById } from "~/controllers/invoices";
import { deleteQuoteById } from "~/controllers/quotes";
import { SITE_TITLE } from "~/root";
import { error } from "~/utils/errors";
import { getUserId } from "~/utils/session";
import { respMidTDClass, respTDClass, respTRClass } from "~/utils/styleClasses";
import type { CustomerType, InvoicesType, QuotesType } from "~/utils/types";
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
  const { customer_id } = params;
  if (!customer_id) return redirect("/customers");
  try {
    const { customer } = await getCustomerById({ customer_id });
    return { customer };
  } catch (error) {
    return { error };
  }
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "edit":
      try {
        const updatedCustomerData = await updateCustomer(values);
        return { updatedCustomerData };
      } catch (error) {
        return { error };
      }
    case "delete_customer":
      try {
        const { code } = await deleteCustomerById(values);
        if (code === 201) return redirect("/customers");
        return {
          error: {
            code: 500,
            message:
              "Internal server error: something went wrong deleting the customer",
          },
        };
      } catch (error) {
        return { error };
      }
    case "delete_quote":
      try {
        const deletedQuoteData = await deleteQuoteById(values);
        return { deletedQuoteData };
      } catch (error) {
        return { error };
      }
    case "delete_invoice":
      try {
        const deletedInvoiceData = await deleteInvoiceById(values);
        return { deletedInvoiceData };
      } catch (error) {
        return { error };
      }
  }
  return {
    error: { code: 400, message: "Bad request: action was not handled" },
  };
}

export default function InvoiceId() {
  const { customer } = useLoaderData();
  const {
    customer_id,
    name,
    tel,
    email,
    address,
    invoice: customerInvoices,
    quote: customerQuotes,
  }: CustomerType = customer;
  const navigation = useNavigation();
  const actionData = useActionData();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const [invoices, setInvoices] = useState(customerInvoices);
  const [quotes, setQuotes] = useState(customerQuotes);
  const [deleteQuoteId, setDeleteQuoteId] = useState(0);
  const [deleteQuoteModelOpen, setDeleteQuoteModalOpen] = useState(false);
  const [deleteInvoiceId, setDeleteInvoiceId] = useState(0);
  const [deleteInvoiceModelOpen, setDeleteInvoiceModalOpen] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState(0);
  const [deleteCustomerModelOpen, setDeleteCustomerModalOpen] = useState(false);
  const [activeMenuItemId, setActiveMenuItemId] = useState(0);
  const [alertData, setAlertData] = useState<error | null>(null);

  useEffect(() => {
    if (!actionData) return;
    const { updatedCustomerData, deletedQuoteData, deletedInvoiceData, error } =
      actionData;
    if (updatedCustomerData) {
      const { code } = updatedCustomerData;
      setAlertData({ code, message: "Success: customer updated" });
    }
    if (deletedQuoteData) {
      const {
        code,
        deletedQuote: { quote_id: deletedQuoteId },
      } = deletedQuoteData;
      setQuotes((oldQuotes) =>
        oldQuotes.filter(({ quote_id }) => quote_id !== deletedQuoteId)
      );
      setDeleteQuoteModalOpen(false);
      setAlertData({ code, message: "Success: quote deleted" });
    }
    if (deletedInvoiceData) {
      const {
        code,
        deletedInvoice: { invoice_id: deletedInvoiceId },
      } = deletedInvoiceData;
      setInvoices((oldInvoices) =>
        oldInvoices.filter(({ invoice_id }) => invoice_id !== deletedInvoiceId)
      );
      setDeleteInvoiceModalOpen(false);
      setAlertData({ code, message: "Success: quote deleted" });
    }
    if (error) setAlertData(error);
  }, [actionData]);

  return (
    <div>
      <h2>Edit customer</h2>
      <CustomerForm
        actionName="edit"
        existingData={{ customer_id, name, tel, email, address }}
        navigation={navigation}
      />
      <h3>Quotes</h3>
      <div className="-m-4 md:mb-0 md:mx-0">
        <table className="table">
          {quotes && quotes.length ? (
            <>
              <thead>
                <tr className="hidden md:table-row">
                  <th>Date</th>
                  <th className="w-full">Customer</th>
                  <th>Amount</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="border-y border-base-content/20">
                {quotes &&
                  quotes.map(
                    ({
                      quote_id,
                      createdAt,
                      quoted_products,
                      labour,
                      discount,
                    }: QuotesType) => (
                      <tr className={respTRClass} key={quote_id}>
                        <td data-label="Date: " className={respMidTDClass}>
                          {prettifyDateString(createdAt.toString())}
                        </td>
                        <td data-label="Customer: " className={respMidTDClass}>
                          {customer.name}
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
                          <ListingItemMenu
                            isOpen={quote_id === activeMenuItemId}
                            setIsOpen={(isOpen) =>
                              setActiveMenuItemId(isOpen ? quote_id : 0)
                            }
                          >
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
                <td className={respTDClass}>No quotes found...</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      <h3>Invoices</h3>
      <div className="-m-4 md:mb-0 md:mx-0">
        <table className="table">
          {invoices && invoices.length ? (
            <>
              <thead>
                <tr className="hidden md:table-row">
                  <th>Date</th>
                  <th className="w-full">Customer</th>
                  <th>Amount</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="border-y border-base-content/20">
                {invoices &&
                  invoices.map(
                    ({
                      invoice_id,
                      createdAt,
                      invoiced_products,
                      labour,
                      discount,
                    }: InvoicesType) => (
                      <tr className={respTRClass} key={invoice_id}>
                        <td data-label="Date: " className={respMidTDClass}>
                          {prettifyDateString(createdAt.toString())}
                        </td>
                        <td data-label="Customer: " className={respMidTDClass}>
                          {customer.name}
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
                          <ListingItemMenu
                            isOpen={invoice_id === activeMenuItemId}
                            setIsOpen={(isOpen) =>
                              setActiveMenuItemId(isOpen ? invoice_id : 0)
                            }
                          >
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
                <td className={respTDClass}>No invoices found...</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
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
        {actionData && actionData.deleteActionsErrors && (
          <p className="text-error mt-1 text-xs">
            {actionData.deleteActionsErrors.info}
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
        {actionData && actionData.deleteActionsErrors && (
          <p className="text-error mt-1 text-xs">
            {actionData.deleteActionsErrors.info}
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
        {actionData && actionData.deleteActionsErrors && (
          <p className="text-error mt-1 text-xs">
            {actionData.deleteActionsErrors.info}
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
      <AlertMessage alertData={alertData} setAlertData={setAlertData} />
    </div>
  );
}
