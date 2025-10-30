import {
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
  DocumentCurrencyPoundIcon,
  DocumentPlusIcon,
  PencilSquareIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { type invoices, Prisma } from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import AlertMessage from "~/components/AlertMessage";
import FormAnchorButton from "~/components/FormAnchorBtn";
import FormBtn from "~/components/FormBtn";
import { getInvoiceBuffer } from "~/components/InvoicePDFDoc";
import ListingItemMenu from "~/components/ListingItemMenu";
import Modal from "~/components/Modal";
import Pagination from "~/components/Pagination";
import SearchInput from "~/components/SearchInput";
import ShareInvoiceFrom from "~/components/ShareInvoiceForm";
import {
  deleteInvoiceById,
  getInvoiceByCustomerSearch,
  getInvoices,
  getInvoicesCount,
} from "~/controllers/invoices";
import { SITE_TITLE, UserContext } from "~/root";
import type { error } from "~/utils/errors";
import {
  type emailBodyData,
  getAllEmails,
  sendEmailPromise,
} from "~/utils/mailer";
import { getUserId } from "~/utils/session";
import {
  createBtnContainerClass,
  respMidTDClass,
  respTDClass,
  respTRClass,
} from "~/utils/styleClasses";
import type { InvoicesWithCustomersType } from "~/utils/types";
import {
  getCurrencyString,
  getGrandTotal,
  getSubtotal,
  prettifyDateString,
  prettifyFilename,
} from "../utils/formatters";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Invoices` }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  try {
    const { invoiceCount } = await getInvoicesCount();
    return { invoiceCount };
  } catch (error) {
    return { error };
  }
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "get_paged_invoices":
      try {
        const { pagedInvoices } = await getInvoices(values);
        return { pagedInvoices };
      } catch (error) {
        return { error };
      }
    case "invoices_search":
      try {
        const { invoices } = await getInvoiceByCustomerSearch(values);
        return { invoices };
      } catch (error) {
        return { error };
      }
    case "delete":
      try {
        const deletedInvoiceData = await deleteInvoiceById(values);
        return { deletedInvoiceData };
      } catch (error) {
        return { error };
      }
    case "share_invoice":
      try {
        const {
          invoiceid,
          currUserEmail,
          subtotal,
          labour,
          discount,
          grandTotal,
          productCount,
          isVatInvoice,
          ...productData
        } = values;

        const allEmails = await getAllEmails(values);
        if (!allEmails)
          return {
            error: {
              code: 500,
              message: "Internal server error: the email has not been sent",
            },
          };

        const emailBodyData: emailBodyData = {
          documentid: invoiceid,
          subtotal,
          labour,
          discount,
          grandTotal,
          productCount,
          productData,
          type: "invoice",
        };

        // TODO: change to getInvoiceBuffer(values)
        const pdfBuffer = await getInvoiceBuffer(
          `${invoiceid}`,
          isVatInvoice === "on",
          `${currUserEmail}`
        );

        // TODO: change to sendEmailPromise(values, pdfBuffer, documentid: invoiceid, type: "invoice")
        const { code } = await sendEmailPromise(
          allEmails,
          emailBodyData,
          pdfBuffer
        );
        return {
          mailSentData: { code, message: "Success: email sent" },
        };
      } catch (error) {
        return { error };
      }
  }
  return {
    error: { code: 400, message: "Bad request: action was not handled" },
  };
}

export default function InvoicesIndex() {
  const user: any = useContext(UserContext);
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [invoices, setInvoices] = useState([]);
  const [deletedInvoiceId, setDeletedInvoiceId] = useState(0);
  const [invoiceToShare, setInvoiceToShare] =
    useState<InvoicesWithCustomersType | null>(null);
  const [isSearched, setIsSearched] = useState(false);
  const [activeMenuItemId, setActiveMenuItemId] = useState(0);
  const [alertData, setAlertData] = useState<error | null>(null);

  useEffect(() => {
    if (!loaderData) return;
    const { invoiceCount: retrievedInvoiceCount } = loaderData;
    if (retrievedInvoiceCount) setInvoiceCount(retrievedInvoiceCount);
    if (loaderData.error) setAlertData(loaderData.error);
  }, [loaderData]);

  useEffect(() => {
    if (!actionData) return;
    const { deletedInvoiceData, mailSentData, error } = actionData;
    if (deletedInvoiceData) {
      const {
        code,
        deletedInvoice: { invoice_id: deletedInvoiceId },
      } = deletedInvoiceData;
      setInvoices((oldInvoices: any) =>
        oldInvoices.filter(
          ({ invoice_id }: invoices) => invoice_id !== deletedInvoiceId
        )
      );
      setAlertData({ code, message: "Success: invoice deleted" });
      setDeletedInvoiceId(0);
    }
    if (mailSentData) {
      setAlertData(mailSentData);
      setInvoiceToShare(null);
    }
    if (error) setAlertData(error);
  }, [actionData]);

  return (
    <>
      <SearchInput
        _action="invoices_search"
        placeholder="start typing to filter invoices..."
        onDataLoaded={({ invoices: retrievedInvoices, error }) => {
          if (retrievedInvoices) {
            const isRetrievedInvoices = retrievedInvoices.length > 0;
            setIsSearched(isRetrievedInvoices);
            if (isRetrievedInvoices) setInvoices(retrievedInvoices);
          }
          if (error) setAlertData(error);
        }}
      />
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
                  invoices.map((invoice: InvoicesWithCustomersType) => {
                    const {
                      invoice_id,
                      createdAt,
                      customer,
                      invoiced_products,
                      labour,
                      discount,
                    } = invoice;
                    return (
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
                              href={`/pdfs/${prettifyFilename(
                                "scuk_invoice",
                                invoice_id,
                                "pdf"
                              )}?type=invoice&id=${invoice_id}`}
                              target="_blank"
                              rel="noreferrer"
                              isSubmitting={isSubmitting}
                            >
                              <DocumentCurrencyPoundIcon className="h-5 w-5 stroke-2" />
                            </FormAnchorButton>
                            <FormAnchorButton
                              href={`/pdfs/${prettifyFilename(
                                "scuk_invoice",
                                invoice_id,
                                "pdf"
                              )}?type=invoice&id=${invoice_id}&isvat=true`}
                              target="_blank"
                              rel="noreferrer"
                              isSubmitting={isSubmitting}
                            >
                              <div className="indicator bg-inherit">
                                <span className="indicator-item indicator-bottom indicator-center badge badge-xs bg-inherit border-0 transition-none">
                                  VAT
                                </span>
                                <DocumentCurrencyPoundIcon className="h-5 w-5 stroke-2" />
                              </div>
                            </FormAnchorButton>
                            <FormBtn
                              isSubmitting={isSubmitting}
                              onClick={() => setInvoiceToShare(invoice)}
                            >
                              <ShareIcon className="h-5 w-5 stroke-2" />
                            </FormBtn>
                            <FormAnchorButton
                              isSubmitting={isSubmitting}
                              href={`invoices/${invoice_id}/edit`}
                            >
                              <PencilSquareIcon className="h-5 w-5 stroke-2" />
                            </FormAnchorButton>
                            <FormBtn
                              isSubmitting={isSubmitting}
                              onClick={() => setDeletedInvoiceId(invoice_id)}
                            >
                              <TrashIcon className="h-5 w-5 stroke-2" />
                            </FormBtn>
                          </ListingItemMenu>
                        </td>
                      </tr>
                    );
                  })}
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
      <div className={createBtnContainerClass}>
        {!isSearched && (
          <Pagination
            className="mr-4"
            totalCount={invoiceCount}
            _action="get_paged_invoices"
            onDataLoaded={({ pagedInvoices }) => {
              if (pagedInvoices) setInvoices(pagedInvoices);
            }}
          />
        )}
        <FormAnchorButton href="/invoices/create">
          <DocumentPlusIcon className="h-5 w-5 stroke-2" />
        </FormAnchorButton>
      </div>
      <Modal open={deletedInvoiceId !== 0}>
        <p>Are you sure you want to delete this invoice?</p>
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
            onClick={() => setDeletedInvoiceId(0)}
          >
            <ArrowUturnLeftIcon className="h-5 w-5 stroke-2" />
          </FormBtn>
        </div>
      </Modal>
      <Modal open={Boolean(invoiceToShare)}>
        <h3 className="mb-4">Share with:</h3>
        {(() => {
          if (!invoiceToShare) return <></>;
          const { invoice_id, customer, invoiced_products, labour, discount } =
            invoiceToShare;
          return (
            <ShareInvoiceFrom
              invoiceid={invoice_id}
              customer={customer}
              productData={{
                invoiced_products,
                labour,
                discount,
                grandTotal: getGrandTotal(
                  getSubtotal(invoiced_products),
                  new Prisma.Decimal(labour),
                  new Prisma.Decimal(discount)
                ),
              }}
              user={user}
              navigation={navigation}
              onCancel={() => {
                setInvoiceToShare(null);
              }}
            />
          );
        })()}
      </Modal>
      <AlertMessage alertData={alertData} setAlertData={setAlertData} />
    </>
  );
}
