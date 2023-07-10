import { useContext } from "react";
import { UserContext } from "~/root";

const NavBar = () => {
  const user: any = useContext(UserContext);
  if (!user) return <div className="navbar bg-base-100"></div>;
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-2 p-2 shadow bg-base-300 rounded-box z-[1]"
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
              <a href="/customers">Customers</a>
            </li>
            <li>
              <a href="/products">Products</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <p>Hi, {user.firstName}</p>
      </div>
      <div className="navbar-end">
        {!user ? (
          <button
            className="btn btn-ghost btn-circle tooltip tooltip-left"
            data-tip="login"
          >
            <a href="/login">
              <svg
                className="w-6 h-6 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                ></path>
              </svg>
            </a>
          </button>
        ) : (
          <button
            className="btn btn-ghost btn-circle tooltip tooltip-left"
            data-tip="logout"
          >
            <a href="/logout">
              <svg
                className="w-6 h-6 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
            </a>
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
