import { Outlet } from "@remix-run/react";
import { contentBodyClass } from "~/utils/styleClasses";

export default function Users() {
  return (
    <div className={contentBodyClass}>
      <Outlet />
    </div>
  );
}
