import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { SITE_TITLE } from "~/root";
import { db } from "~/utils/db";
import { getUserId } from "~/utils/session";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Quotes` }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  try {
    const quotes = await db.quotes.findMany();
    return json({ quotes });
  } catch (err) {
    console.error(err);
    return {};
  }
};

export default function QuotesIndex() {
  const TD_CLASSNAME =
    "before:content-[attr(data-label)] before:block before:mb-1 md:before:hidden";
  const { quotes } = useLoaderData();
  console.log({ quotes });
  return (
    <>
      {quotes && quotes.length ? (
        <div className="-mx-4">
          <table className="table static">
            <thead>
              <tr className="hidden md:table-row">
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {quotes &&
                quotes.map((loopedQuotes: any) => {
                  return (
                    <tr
                      className="flex flex-col md:table-row"
                      key={loopedQuotes.quote_id}
                    >
                      <td data-label="ID" className={TD_CLASSNAME}>
                        {loopedQuotes.quote_id}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No quotes found...</p>
      )}
      <div className="flex justify-end mt-4">
        <a href="#" className="btn btn-neutral">
          Add new invoice +
        </a>
      </div>
    </>
  );
}
