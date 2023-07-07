import { Outlet } from "react-router";
import NavBar from "~/components/NavBar";

export default function User() {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
}
