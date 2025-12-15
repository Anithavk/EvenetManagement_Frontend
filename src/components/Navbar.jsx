import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [imgSrc, setImgSrc] = useState("https://via.placeholder.com/40");
  const userMenuRef = useRef();

  // Update avatar if user changes
  useEffect(() => {
    if (user?.avatar) {
      setImgSrc(user.avatar);
    } else {
      setImgSrc("https://via.placeholder.com/40");
    }
  }, [user]);

  // Close user menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenu(false);
    setMobileMenu(false);
  };

  return (
    <nav className="bg-gray-900 text-white px-4 sm:px-6 py-3 sm:py-4 relative z-20 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          EventHub
        </Link>

        {/* Mobile menu button */}
        <button
          className="sm:hidden"
          onClick={() => {
            setMobileMenu(!mobileMenu);
            setUserMenu(false);
          }}
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Desktop menu */}
        <div className="hidden sm:flex items-center gap-6">
          {!user ? (
            <>
              <Link to="/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link to="/register" className="hover:text-gray-300">
                Register
              </Link>
            </>
          ) : (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenu(!userMenu)}
                className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded hover:bg-gray-700"
              >
                <img
                  src={imgSrc}
                  alt="User Avatar"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    setImgSrc("https://via.placeholder.com/40");
                  }}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>{user.name}</span>
              </button>

              {userMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-30 py-2">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setUserMenu(false)}
                  >
                    My Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setUserMenu(false)}
                  >
                    My Profile
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setUserMenu(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 bg-red-500 text-white hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="sm:hidden absolute left-0 top-full w-full bg-gray-800 p-4 rounded-b-lg space-y-3 z-30">
          {!user ? (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenu(false)}
                className="block hover:text-gray-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenu(false)}
                className="block hover:text-gray-300"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenu(false)}
                className="block hover:text-gray-300"
              >
                My Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenu(false)}
                className="block hover:text-gray-300"
              >
                My Profile
                
              </Link>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenu(false)}
                  className="block hover:text-gray-300"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block w-full text-left bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
