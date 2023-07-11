import {
  redirect,
  type LoaderArgs,
  type V2_MetaFunction,
} from "@remix-run/node";
import NavBar from "~/components/NavBar";
import { SITE_TITLE } from "~/root";
import { getUserId } from "~/utils/session";

export const meta: V2_MetaFunction = () => {
  return [{ title: SITE_TITLE }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  return {};
};

export default function IndexRoute() {
  return (
    <>
      <NavBar />
      <div className="md:container md:mx-auto px-6">
        <h1>Welcome to Smart CCTV admin</h1>
      </div>
    </>
  );
}
