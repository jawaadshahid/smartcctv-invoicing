import {
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
  DocumentPlusIcon,
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
  useNavigation,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import FormAnchorButton from "~/components/FormAnchorBtn";
import FormBtn from "~/components/FormBtn";
import Modal from "~/components/Modal";
import Pagination from "~/components/Pagination";
import SearchInput from "~/components/SearchInput";
import {
  deleteInvoiceById,
  getInvoiceByCustomerSearch,
  getInvoices,
  getInvoicesCount,
} from "~/controllers/invoices";
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

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  try {
    const invoiceCount = await getInvoicesCount();
    return json({ invoiceCount });
  } catch (err) {
    console.error(err);
    return {};
  }
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "get_paged_invoices":
      const { skip, take } = values;
      const pagedInvoices = await getInvoices(
        parseInt(skip.toString()),
        parseInt(take.toString())
      );
      return { pagedInvoices };
    case "invoices_search":
      const { search_term } = values;
      const invoices =
        search_term.toString().length > 0
          ? await getInvoiceByCustomerSearch(search_term.toString())
          : await getInvoices();
      return { invoices };
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

export default function InvoicesIndex() {
  const { invoiceCount }: any = useLoaderData();
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [invoices, setInvoices] = useState([]);
  const [deletedInvoiceId, setDeletedInvoiceId] = useState(0);
  const [deleteModelOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!data) return;
    if (data.invoiceDeleted) setDeleteModalOpen(false);
  }, [data]);

  return (
    <>
      <SearchInput
        _action="invoices_search"
        placeholder="start typing to filter invoices..."
        onDataLoaded={(fetchedData) => {
          if (fetchedData.invoices) setInvoices(fetchedData.invoices);
        }}
      />
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
                    customer,
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
                          <div className="absolute md:static top-0 right-3 btn-group">
                            <FormAnchorButton
                              isSubmitting={isSubmitting}
                              href={`invoices/${invoice_id}`}
                            >
                              <EyeIcon className="h-5 w-5 stroke-2" />
                            </FormAnchorButton>
                            <FormAnchorButton
                              isSubmitting={isSubmitting}
                              href={`invoices/${invoice_id}/edit`}
                            >
                              <PencilSquareIcon className="h-5 w-5 stroke-2" />
                            </FormAnchorButton>
                            <FormBtn
                              isSubmitting={isSubmitting}
                              onClick={() => {
                                setDeletedInvoiceId(invoice_id);
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
        <p>No invoices found...</p>
      )}
      <div className={createBtnContainerClass}>
        <Pagination
          className="mr-4"
          totalCount={invoiceCount}
          _action="get_paged_invoices"
          onDataLoaded={({ pagedInvoices }) => {
            if (pagedInvoices) setInvoices(pagedInvoices);
          }}
        />
        <FormAnchorButton href="/invoices/create">
          <DocumentPlusIcon className="h-5 w-5 stroke-2" />
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
