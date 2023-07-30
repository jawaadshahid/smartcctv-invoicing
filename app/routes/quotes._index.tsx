import type { customers, quoted_products } from "@prisma/client";
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
import { SITE_TITLE } from "~/root";
import { db, deleteQuoteById, deleteQuotedProdsById } from "~/utils/db";
import { getUserId } from "~/utils/session";
import { resTDClass, resTRClass } from "~/utils/styleClasses";

type QuotesType = {
  quote_id: number;
  createdAt: string;
  updatedAt: string;
  customer: customers;
  labour: number;
  discount: number;
  quoted_products: quoted_products[];
};

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
        await deleteQuotedProdsById(parseInt(`${quote_id}`));
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
    const quotes = await db.quotes.findMany({
      include: {
        customer: true,
        quoted_products: true,
      },
    });
    return json({ quotes });
  } catch (err) {
    console.error(err);
    return {};
  }
};

const prettifyDateString = (dateString: string) => {
  const date = new Date(dateString);
  return date.toDateString();
};

export default function QuotesIndex() {
  const { quotes } = useLoaderData();
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
        <table className="table static">
          <thead>
            <tr className="hidden md:table-row">
              <th>ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Amount (£)</th>
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
                    <tr className={resTRClass} key={quote_id}>
                      <td data-label="ID" className={resTDClass}>
                        {quote_id}
                      </td>
                      <td data-label="Date" className={resTDClass}>
                        {prettifyDateString(createdAt)}
                      </td>
                      <td data-label="Customer" className={resTDClass}>
                        {customer.name}
                      </td>
                      <td data-label="Amount (£)" className={resTDClass}>
                        {quoted_products.reduce(
                          (partialSum, qp) =>
                            partialSum + qp.price * qp.quantity,
                          0
                        ) +
                          labour -
                          discount}
                      </td>
                      <td data-label="Actions" className={resTDClass}>
                        <div className="btn-group">
                          <FormAnchorButton
                            isSubmitting={isSubmitting}
                            href={`quotes/${quote_id}`}
                          >
                            View
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
      ) : (
        <p>No quotes found...</p>
      )}
      <div className="flex justify-end mt-4">
        <FormAnchorButton href="/quotes/create">
          Add new quote +
        </FormAnchorButton>
      </div>
      <Modal open={deleteModelOpen}>
        <p className="py-4">Are you sure you want to delete this quote?</p>
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
