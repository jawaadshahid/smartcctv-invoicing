import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderArgs) => {
  try {
    const url = new URL(request.url);
    const search = new URLSearchParams(url.search);
    const userid = search.get("uid");
    return { userid };
  } catch (err) {
    console.error(err);
    redirect("/users");
    return {};
  }
};

export default function DeleteUser() {
  const { userid } = useLoaderData();
  return (
    <div className="grid h-screen place-items-center">
      <div className="shadow">
        Are you sure to delet the user?
        <a className="text-red-200" href={`delete?uid=${userid}`}>
          Delete
        </a>
      </div>
    </div>
  );
}
