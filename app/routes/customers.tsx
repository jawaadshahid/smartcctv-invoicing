import { Outlet } from "react-router";
import { contentBodyClass } from "~/utils/styleClasses";

export default function Customers() {
  return (
    <div className={contentBodyClass}>
      <Outlet />
    </div>
  );
}
