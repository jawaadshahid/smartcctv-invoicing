import { Outlet } from "react-router";

export default function Users() {
  return (
    <div className="md:container md:mx-auto p-6">
      <Outlet />
    </div>
  );
}
