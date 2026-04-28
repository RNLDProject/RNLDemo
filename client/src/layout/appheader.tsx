import { useSidebar } from "../Context/SideBarContext";
import { useHeader } from "../Context/HeaderContext";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const AppHeader = () => {
  const { isOpen, toggleUserMenu } = useHeader();
  const sidebar = useSidebar();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { user, logout } = useAuth();

  const fullName = useMemo(() => {
    if (!user) return "";

    let formattedName = `${user.user.last_name}, ${user.user.first_name}`;

    if (user.user.middle_name) {
      formattedName += ` ${user.user.middle_name.charAt(0)}.`;
    }

    if (user.user.suffix_name) {
      formattedName += ` ${user.user.suffix_name}`;
    }

    return formattedName;
  }, [user]);

  const userInitials = useMemo(() => {
    if (!user) return "U";

    return `${user.user.first_name.charAt(0)}${user.user.last_name.charAt(0)}`.toUpperCase();
  }, [user]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      await logout();
      navigate("/");
    } catch (error) {
      console.error(
        "Unexpected server error occurred during logging user out: ",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              type="button"
              onClick={() => sidebar.toggleSidebar()}
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
              </svg>
            </button>

            <a href="/" className="flex ms-2 md:me-24">
              <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 me-3" alt="FlowBite Logo" />
              <span className="self-center text-xl font-bold sm:text-2xl whitespace-nowrap dark:text-white">Flowbite</span>
            </a>
          </div>

          <div className="flex items-center">
            <div className="flex items-center ms-3 relative">
              <div>
                <button
                  type="button"
                  onClick={() => toggleUserMenu()}
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                    {userInitials}
                  </div>
                </button>
              </div>

              {isOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={toggleUserMenu}></div>

                  <div className="absolute right-0 top-10 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 min-w-[150px]">
                    <div className="px-4 py-3" role="none">
                      <p className="text-sm text-gray-900 dark:text-white text-left" role="none">
                        {fullName || "Unknown User"}
                      </p>
                      <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300 text-left" role="none">
                        {user?.user.username ?? ""}
                      </p>
                    </div>
                    <ul className="py-1" role="none">
                      <li>
                        <button
                          type="button"
                          className="block w-full cursor-pointer px-4 py-2 text-start text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                          onClick={handleLogout}
                          disabled={isLoading}
                        >
                          {isLoading ? "Signing Out..." : "Sign Out"}
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppHeader;