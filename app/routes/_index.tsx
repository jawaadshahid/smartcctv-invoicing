import type { V2_MetaFunction } from "@remix-run/node";
import NavBar from "~/components/NavBar";
import { SITE_TITLE } from "~/root";

export const meta: V2_MetaFunction = () => {
  return [
    { title: SITE_TITLE },
  ];
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
