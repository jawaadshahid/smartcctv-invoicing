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
  deleteQuoteById,
  getQuotes,
  getQuotesByCustomerSearch,
  getQuotesCount,
} from "~/controllers/quotes";
import { SITE_TITLE } from "~/root";
import { getUserId } from "~/utils/session";
import {
  createBtnContainerClass,
  respTDClass,
  respTRClass,
} from "~/utils/styleClasses";
import type { QuotesType } from "~/utils/types";
import {
  getCurrencyString,
  getGrandTotal,
  getSubtotal,
  prettifyDateString,
} from "../utils/formatters";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Quotes` }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  try {
    const quoteCount = await getQuotesCount();
    return json({ quoteCount });
  } catch (err) {
    console.error(err);
    return {};
  }
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "get_paged_quotes":
      const { skip, take } = values;
      const pagedQuotes = await getQuotes(
        parseInt(skip.toString()),
        parseInt(take.toString())
      );
      return { pagedQuotes };
    case "quotes_search":
      const { search_term } = values;
      const quotes =
        search_term.toString().length > 0
          ? await getQuotesByCustomerSearch(search_term.toString())
          : await getQuotes();
      return { quotes };
    case "delete":
      const { quote_id } = values;
      const deleteActionsErrors: any = {};
      try {
        await deleteQuoteById(parseInt(`${quote_id}`));
        return { quoteDeleted: true };
      } catch (err) {
        console.error(err);
        deleteActionsErrors.info = `There was a problem deleting quote with id: ${quote_id}`;
        return { deleteActionsErrors };
      }
  }
}

export default function QuotesIndex() {
  const { quoteCount }: any = useLoaderData();
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [quotes, setQuotes] = useState([]);
  const [deletedQuoteId, setDeletedQuoteId] = useState(0);
  const [deleteModelOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!data) return;
    if (data.quoteDeleted) setDeleteModalOpen(false);
  }, [data]);

  return (
    <>
      <SearchInput
        _action="quotes_search"
        placeholder="start typing to filter quotes..."
        onDataLoaded={(fetchedData) => {
          if (fetchedData.quotes) setQuotes(fetchedData.quotes);
        }}
      />
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
                    customer,
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
                          <div className="absolute md:static top-0 right-3 btn-group">
                            <FormAnchorButton
                              isSubmitting={isSubmitting}
                              href={`quotes/${quote_id}`}
                            >
                              <EyeIcon className="h-5 w-5 stroke-2" />
                            </FormAnchorButton>
                            <FormAnchorButton
                              isSubmitting={isSubmitting}
                              href={`quotes/${quote_id}/edit`}
                            >
                              <PencilSquareIcon className="h-5 w-5 stroke-2" />
                            </FormAnchorButton>
                            <FormBtn
                              isSubmitting={isSubmitting}
                              onClick={() => {
                                setDeletedQuoteId(quote_id);
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
        <p>No quotes found...</p>
      )}
      <div className={createBtnContainerClass}>
        <Pagination
          className="mr-4"
          totalCount={quoteCount}
          _action="get_paged_quotes"
          onDataLoaded={({ pagedQuotes }) => {
            if (pagedQuotes) setQuotes(pagedQuotes);
          }}
        />
        <FormAnchorButton href="/quotes/create">
          <DocumentPlusIcon className="h-5 w-5 stroke-2" />
        </FormAnchorButton>
      </div>
      <Modal open={deleteModelOpen}>
        <p>Are you sure you want to delete this quote?</p>
        {data && data.deleteActionsErrors && (
          <p className="text-error mt-1 text-xs">
            {data.deleteActionsErrors.info}
          </p>
        )}
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
            onClick={() => setDeleteModalOpen(false)}
          >
            <ArrowUturnLeftIcon className="h-5 w-5 stroke-2" />
          </FormBtn>
        </div>
      </Modal>
    </>
  );
}
