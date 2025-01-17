import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import StoreIcon from "@mui/icons-material/Store";

function HeaderHomePage() {
  const [nav, setNav] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header>
      <div className="bg-gradient-to-r from-[#1E1E2F] to-[#662D91] text-white px-4 lg:px-6">
        <div className="mx-auto max-w-screen-lg">
          <a
            href=""
            className="font-semibold text-lg hover:text-purple-300 flex items-center h-10"
          >
            <StoreIcon className="mr-1" />
            <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Shop</span>
          </a>
        </div>
      </div>
      <nav className="bg-gradient-to-r from-[#1E1E2F] to-[#662D91] text-white px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-lg">
          <span className="self-center text-xl font-bold whitespace-nowrap text-white">
            <div className="flex items-center">
              <i className="fas fa-laptop mr-2 text-2xl"></i>
              <h1 className="text-lg text-white font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                FPT E-Laptop
              </h1>
            </div>
          </span>

          <div
            className={`flex-col md:flex md:flex-row items-center w-full md:w-auto md:order-2 transition-all duration-300 ${
              nav
                ? "absolute top-14 left-0 w-full bg-[#1E1E2F] shadow-md p-4 md:relative md:top-0 md:w-auto md:bg-transparent md:shadow-none"
                : "hidden md:flex gap-6"
            }`}
          >
            <ul className="flex flex-col md:flex-row md:gap-8 gap-4">
              <li>
                <a
                  href="/"
                  className="block py-2 pr-4 pl-3 text-white font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] hover:text-purple-300"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/laptoppurchase"
                  className="block py-2 pr-4 pl-3 text-white font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] hover:text-purple-300"
                >
                  Laptops
                </a>
              </li>
              <li>
                <a
                  href="/laptopborrow"
                  className="block py-2 pr-4 pl-3 text-white font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] hover:text-purple-300"
                >
                  Borrow Laptop
                </a>
              </li>
            </ul>
            <div className="flex flex-col md:flex-row items-center gap-4 ml-2">
              <a
                href="/cart"
                className="text-white relative hover:text-purple-300"
              >
                <ShoppingCartCheckoutIcon />
                <span className="absolute -top-2 -right-2 inline-block w-5 h-5 text-xs font-semibold text-center text-white bg-red-500 rounded-full leading-5">
                  3
                </span>
              </a>

              {location.pathname === "/home" && (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="rounded-full bg-[#662D91] bg-opacity-70 py-2 px-4 text-center text-sm text-white transition-all hover:bg-opacity-90 hover:shadow-lg"
                    type="button"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="rounded-full bg-[#662D91] bg-opacity-70 py-2 px-4 text-center text-sm text-white transition-all hover:bg-opacity-90 hover:shadow-lg"
                    type="button"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center lg:order-1">
            <button
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-400 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-controls="mobile-menu"
              aria-expanded={nav}
              onClick={() => setNav(!nav)}
            >
              <span className="sr-only">Open main menu</span>
              {nav ? (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>
      <hr />
    </header>
  );
}

export default HeaderHomePage;
