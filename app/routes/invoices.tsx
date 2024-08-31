import { Outlet } from "react-router";
import { contentBodyClass } from "~/utils/styleClasses";

export default function Invoices() {
  return (
    <div className={contentBodyClass}>
      <Outlet />
    </div>
  );
}
