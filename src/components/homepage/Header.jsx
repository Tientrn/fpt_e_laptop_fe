import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function HeaderHomePage() {
  const [nav, setNav] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header>
      <nav className="bg-gray-700 border-gray-200 px-4 lg:px-6 py-2.5 shadow">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-lg">
          <a href="#" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
              <div className="flex items-center">
                <i className="fas fa-laptop mr-2 text-2xl"></i>
                <h1 className="text-lg text-white">FPT E-Laptop</h1>
              </div>
            </span>
          </a>

          <div
            className={`flex-col md:flex md:flex-row items-center w-full md:w-auto md:order-2 transition-all duration-300 ${
              nav
                ? "absolute top-14 left-0 w-full bg-gray-700 shadow-md p-4 md:relative md:top-0 md:w-auto md:bg-transparent md:shadow-none"
                : "hidden md:flex gap-6"
            }`}
          >
            <ul className="flex flex-col md:flex-row md:gap-8 gap-4">
              <li>
                <a
                  href="/home"
                  className="block py-2 pr-4 pl-3 text-white rounded hover:bg-gray-600 md:hover:bg-transparent md:hover:text-gray-300"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/home/product"
                  className="block py-2 pr-4 pl-3 text-white border-b border-gray-600 hover:bg-gray-600 md:hover:bg-transparent md:hover:text-gray-300"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pr-4 pl-3 text-white border-b border-gray-600 hover:bg-gray-600 md:hover:bg-transparent md:hover:text-gray-300"
                >
                  Borrow Laptop
                </a>
              </li>
            </ul>
            <div className="flex flex-col md:flex-row items-center gap-4 ml-2">
              <button
                onClick={() => navigate("/login")}
                className="rounded-full bg-white py-2 px-4 text-center text-sm text-black transition-all shadow-md hover:shadow-lg hover:bg-red-500 hover:text-white focus:bg-red-500 focus:shadow-none active:bg-red-600 disabled:pointer-events-none disabled:opacity-50"
                type="button"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="rounded-full bg-white py-2 px-4 text-center text-sm text-black transition-all shadow-md hover:shadow-lg hover:bg-red-500 hover:text-white focus:bg-red-500 focus:shadow-none active:bg-red-600 disabled:pointer-events-none disabled:opacity-50"
                type="button"
              >
                Sign Up
              </button>
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
      {location.pathname === "/home" && (
        <div
          className="flex items-center justify-center min-h-screen bg-cover bg-center "
          style={{
            backgroundImage: "url(../src/assets/banner.jpg)", // Thay thế bằng URL ảnh của bạn
          }}
        >
          <div className="bg-black bg-opacity-70 p-8 rounded-lg text-center shadow-lg transform transition-transform duration-300 hover:scale-105">
            <h1 className="text-4xl font-bold text-white mb-4 pointer-events-none">
              Welcome to FPT E-Laptop
            </h1>
            <p className="text-lg text-yellow-400 mt-2 leading-relaxed pointer-events-none">
              Discover our high quality laptop Borrow and Sales!
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

export default HeaderHomePage;
