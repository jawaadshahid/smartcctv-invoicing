import {
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
  DocumentCurrencyPoundIcon,
  DocumentDuplicateIcon,
  DocumentPlusIcon,
  PencilSquareIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Prisma, quotes } from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import AlertMessage from "~/components/AlertMessage";
import FormAnchorButton from "~/components/FormAnchorBtn";
import FormBtn from "~/components/FormBtn";
import ListingItemMenu from "~/components/ListingItemMenu";
import Modal from "~/components/Modal";
import Pagination from "~/components/Pagination";
import { getQuoteBuffer } from "~/components/QuotePDFDoc";
import SearchInput from "~/components/SearchInput";
import ShareQuoteForm from "~/components/ShareQuoteForm";
import { createInvoiceFromQuoteById } from "~/controllers/invoices";
import {
  deleteQuoteById,
  getQuotes,
  getQuotesByCustomerSearch,
  getQuotesCount,
} from "~/controllers/quotes";
import { SITE_TITLE, UserContext } from "~/root";
import { error } from "~/utils/errors";
import { emailBodyData, getAllEmails, sendEmailPromise } from "~/utils/mailer";
import { getUserId } from "~/utils/session";
import {
  createBtnContainerClass,
  respMidTDClass,
  respTDClass,
  respTRClass,
} from "~/utils/styleClasses";
import type { QuotesWithCustomersType } from "~/utils/types";
import {
  getCurrencyString,
  getGrandTotal,
  getSubtotal,
  prettifyDateString,
  prettifyFilename,
} from "../utils/formatters";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Quotes` }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  try {
    const { quoteCount } = await getQuotesCount();
    return { quoteCount };
  } catch (error) {
    return { error };
  }
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "get_paged_quotes":
      try {
        const { pagedQuotes } = await getQuotes(values);
        return { pagedQuotes };
      } catch (error) {
        return { error };
      }
    case "quotes_search":
      try {
        const { quotes } = await getQuotesByCustomerSearch(values);
        return { quotes };
      } catch (error) {
        return { error };
      }
    case "delete":
      try {
        const deletedQuoteData = await deleteQuoteById(values);
        return { deletedQuoteData };
      } catch (error) {
        return { error };
      }
    case "generate_invoice":
      try {
        const createdInvoiceData = await createInvoiceFromQuoteById(values);
        return { createdInvoiceData };
      } catch (error) {
        return { error };
      }
    case "share_quote":
      try {
        const {
          quoteid,
          userEmail,
          subtotal,
          labour,
          discount,
          grandTotal,
          productCount,
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
          documentid: quoteid,
          subtotal,
          labour,
          discount,
          grandTotal,
          productCount,
          productData,
          type: "quote",
        };

        const pdfBuffer = await getQuoteBuffer(`${quoteid}`);

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

export default function QuotesIndex() {
  const user: any = useContext(UserContext);
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const submit = useSubmit();
  const isSubmitting = navigation.state === "submitting";
  const [quoteCount, setQuoteCount] = useState(0);
  const [quotes, setQuotes] = useState([]);
  const [deletedQuoteId, setDeletedQuoteId] = useState(0);
  const [quoteToShare, setQuoteToShare] =
    useState<QuotesWithCustomersType | null>(null);
  const [isSearched, setIsSearched] = useState(false);
  const [activeMenuItemId, setActiveMenuItemId] = useState(0);
  const [alertData, setAlertData] = useState<error | null>(null);

  useEffect(() => {
    if (!loaderData) return;
    const { quoteCount: retrievedQuoteCount } = loaderData;
    if (retrievedQuoteCount) setQuoteCount(retrievedQuoteCount);
    if (loaderData.error) setAlertData(loaderData.error);
  }, [loaderData]);

  useEffect(() => {
    if (!actionData) return;
    const { deletedQuoteData, createdInvoiceData, mailSentData, error } =
      actionData;
    if (deletedQuoteData) {
      const {
        code,
        deletedQuote: { quote_id: deletedQuoteId },
      } = deletedQuoteData;
      setQuotes((oldQuotes: any) =>
        oldQuotes.filter(({ quote_id }: quotes) => quote_id !== deletedQuoteId)
      );
      setAlertData({ code, message: "Success: quote deleted" });
      setDeletedQuoteId(0);
    }
    if (createdInvoiceData) {
      const { code } = createdInvoiceData;
      setAlertData({ code, message: "Success: invoice created" });
      setTimeout(() => navigate(`/invoices`, { replace: true }), 2000);
    }
    if (mailSentData) {
      setAlertData(mailSentData);
      setQuoteToShare(null);
    }
    if (error) setAlertData(error);
  }, [actionData]);

  return (
    <>
      <SearchInput
        _action="quotes_search"
        placeholder="start typing to filter quotes..."
        onDataLoaded={({ quotes: retrievedQuotes, error }) => {
          if (retrievedQuotes) {
            const isRetrievedQuotes = retrievedQuotes.length > 0;
            setIsSearched(isRetrievedQuotes);
            if (isRetrievedQuotes) setQuotes(retrievedQuotes);
          }
          if (error) setAlertData(error);
        }}
      />
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
                  quotes.map((quote: QuotesWithCustomersType) => {
                    const {
                      quote_id,
                      createdAt,
                      customer,
                      quoted_products,
                      labour,
                      discount,
                    } = quote;
                    return (
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
                              href={`/pdfs/${prettifyFilename(
                                "scuk_quote",
                                quote_id,
                                "pdf"
                              )}?type=quote&id=${quote_id}`}
                              target="_blank"
                              rel="noreferrer"
                              isSubmitting={isSubmitting}
                            >
                              <DocumentCurrencyPoundIcon className="h-5 w-5 stroke-2" />
                            </FormAnchorButton>
                            <FormBtn
                              isSubmitting={isSubmitting}
                              onClick={() => setQuoteToShare(quote)}
                            >
                              <ShareIcon className="h-5 w-5 stroke-2" />
                            </FormBtn>
                            <FormBtn
                              isSubmitting={isSubmitting}
                              onClick={() => {
                                console.log({ quote_id });
                                const formData = new FormData();
                                formData.append("_action", "generate_invoice");
                                formData.append("quote_id", `${quote_id}`);
                                submit(formData, { method: "post" });
                              }}
                            >
                              <DocumentDuplicateIcon className="h-5 w-5 stroke-2" />
                            </FormBtn>
                            <FormAnchorButton
                              isSubmitting={isSubmitting}
                              href={`quotes/${quote_id}/edit`}
                            >
                              <PencilSquareIcon className="h-5 w-5 stroke-2" />
                            </FormAnchorButton>
                            <FormBtn
                              isSubmitting={isSubmitting}
                              onClick={() => setDeletedQuoteId(quote_id)}
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
                <td className={respTDClass}>No quotes found...</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      <div className={createBtnContainerClass}>
        {!isSearched && (
          <Pagination
            className="mr-4"
            totalCount={quoteCount}
            _action="get_paged_quotes"
            onDataLoaded={({ pagedQuotes }) => {
              if (pagedQuotes) setQuotes(pagedQuotes);
            }}
          />
        )}
        <FormAnchorButton href="/quotes/create">
          <DocumentPlusIcon className="h-5 w-5 stroke-2" />
        </FormAnchorButton>
      </div>
      <Modal open={deletedQuoteId !== 0}>
        <p>Are you sure you want to delete this quote?</p>
        <div className="modal-action">
          <Form replace method="post">
            <input type="hidden" name="quote_id" value={deletedQuoteId} />
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
            onClick={() => setDeletedQuoteId(0)}
          >
            <ArrowUturnLeftIcon className="h-5 w-5 stroke-2" />
          </FormBtn>
        </div>
      </Modal>
      <Modal open={Boolean(quoteToShare)}>
        <h3 className="mb-4">Share with:</h3>
        {(() => {
          if (!quoteToShare) return <></>;
          const { quote_id, customer, quoted_products, labour, discount } =
            quoteToShare;
          return (
            <ShareQuoteForm
              quoteid={quote_id}
              customer={customer}
              productData={{
                quoted_products,
                labour,
                discount,
                grandTotal: getGrandTotal(
                  getSubtotal(quoted_products),
                  new Prisma.Decimal(labour),
                  new Prisma.Decimal(discount)
                ),
              }}
              user={user}
              navigation={navigation}
              onCancel={() => setQuoteToShare(null)}
            />
          );
        })()}
      </Modal>
      <AlertMessage alertData={alertData} setAlertData={setAlertData} />
    </>
  );
}
