import {
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useContext } from "react";
import { UserContext } from "~/root";

const NavBar = () => {
  const user: any = useContext(UserContext);
  if (!user) return <div className="navbar bg-base-100"></div>;
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown fixed z-20">
          <label tabIndex={0} className="btn">
            <Bars3Icon className="h-5 w-5 stroke-2" />
          </label>
          <ul
            tabIndex={0}
            className="prose prose-li:pl-0 prose-a:no-underline menu dropdown-content mt-2 p-2 shadow bg-base-300 rounded-box z-[1]"
          >
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              {user.isAdmin ? (
                <a href="/users">Users</a>
              ) : (
                <a href={`/users/${user.id}`}>My details</a>
              )}
            </li>
            <li>
              <a href="/quotes">Quotes</a>
            </li>
            <li>
              <a href="/invoices">Invoices</a>
            </li>
            <li>
              <a href="/customers">Customers</a>
            </li>
            <li>
              <a href="/products">Products</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <img
          className="h-10 w-auto mx-4"
          src="https://smartcctvuk.co.uk/img/logo-small.png"
          alt=""
        />
      </div>
      <div className="navbar-end">
        {user && (
          <>
            <p className="hidden md:block mr-2 text-neutral-content">
              Hi, {user.firstName}
            </p>
            <button className="btn tooltip tooltip-left" data-tip="logout">
              <a href="/logout">
                <ArrowRightStartOnRectangleIcon className="h-5 w-5 stroke-2 mx-auto" />
              </a>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
