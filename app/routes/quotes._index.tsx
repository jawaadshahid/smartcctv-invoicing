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
import { deleteQuoteById, getQuotes } from "~/controllers/quotes";
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

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
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

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  try {
    const quotes = await getQuotes();
    return json({ quotes });
  } catch (err) {
    console.error(err);
    return {};
  }
};

export default function QuotesIndex() {
  const { quotes }: { quotes: QuotesType[] | any[] } = useLoaderData();
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [deletedQuoteId, setDeletedQuoteId] = useState(0);
  const [deleteModelOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!data) return;
    if (data.quoteDeleted) setDeleteModalOpen(false);
  }, [data]);

  return (
    <>
      {quotes && quotes.length ? (
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
                        <td data-label="ID" className={respTDClass}>
                          {quote_id}
                        </td>
                        <td data-label="Date" className={respTDClass}>
                          {prettifyDateString(createdAt)}
                        </td>
                        <td data-label="Customer" className={`${respTDClass} w-full`}>
                          {customer.name}
                        </td>
                        <td data-label="Amount" className={respTDClass}>
                          {getCurrencyString(
                            getGrandTotal(
                              getSubtotal(quoted_products),
                              new Prisma.Decimal(labour),
                              new Prisma.Decimal(discount)
                            )
                          )}
                        </td>
                        <td data-label="Actions" className={respTDClass}>
                          <div className="btn-group">
                            <FormAnchorButton
                              isSubmitting={isSubmitting}
                              href={`quotes/${quote_id}`}
                            >
                              View
                            </FormAnchorButton>
                            <FormAnchorButton
                              isSubmitting={isSubmitting}
                              href={`quotes/${quote_id}/edit`}
                            >
                              Edit
                            </FormAnchorButton>
                            <FormBtn
                              isSubmitting={isSubmitting}
                              onClick={() => {
                                setDeletedQuoteId(quote_id);
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
        <p>No quotes found...</p>
      )}
      <div className={createBtnContainerClass}>
        <FormAnchorButton href="/quotes/create">
          Add new quote +
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
