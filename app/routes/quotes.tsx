import { Outlet } from "react-router";
import { contentBodyClass } from "~/utils/styleClasses";

export default function Quotes() {
  return (
    <div className={contentBodyClass}>
      <Outlet />
    </div>
  );
}
