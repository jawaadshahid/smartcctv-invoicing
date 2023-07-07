import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/utils/db";
import { getUserId } from "~/utils/session";

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/users/login");

  try {
    const url = new URL(request.url);
    const search = new URLSearchParams(url.search);
    const userid = search.get("uid") as string;

    await db.users.delete({
      where: {
        id: parseInt(userid),
      },
    });

    return redirect("/users");
  } catch (err) {
    console.error(err);
    redirect("/users");
    return {};
  }
};
