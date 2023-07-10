import { Outlet } from "react-router";
import NavBar from "~/components/NavBar";

export default function Customers() {
  return (
    <div>
      <NavBar />
      <div className="md:container md:mx-auto px-6">
        <Outlet />
      </div>
    </div>
  );
}