import React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const products = [
  {
    id: 1,
    name: "Dell XPS 13",
    href: "#",
    color: "Silver",
    price: "$1,200.00",
    quantity: 1,
    imageSrc:
      "https://th.bing.com/th/id/R.569a83bfaf59779cf28b12151acab4e8?rik=3zc3E%2fwQLOdtnQ&pid=ImgRaw&r=0",
    imageAlt: "Dell XPS 13 laptop with a sleek silver finish.",
  },
  {
    id: 2,
    name: "MacBook Pro 14",
    href: "#",
    color: "Space Gray",
    price: "$2,000.00",
    quantity: 1,
    imageSrc: "https://example.com/images/macbook-pro-14.jpg",
    imageAlt: "Apple MacBook Pro 14-inch with Space Gray finish.",
  },
  {
    id: 3,
    name: "Lenovo ThinkPad X1 Carbon",
    href: "#",
    color: "Black",
    price: "$1,500.00",
    quantity: 1,
    imageSrc: "https://example.com/images/lenovo-thinkpad-x1.jpg",
    imageAlt: "Lenovo ThinkPad X1 Carbon laptop with a matte black finish.",
  },
  {
    id: 4,
    name: "HP Spectre x360",
    href: "#",
    color: "Dark Ash Silver",
    price: "$1,400.00",
    quantity: 1,
    imageSrc: "https://example.com/images/hp-spectre-x360.jpg",
    imageAlt:
      "HP Spectre x360 convertible laptop with a Dark Ash Silver color.",
  },
  // More products...
];

export default function Cart() {
  const [open, setOpen] = useState(true);
  return (
    <div className=" mx-auto p-6 bg-black">
      {/* Shopping Cart Section */}
      <div className="grid grid-cols-3 gap-8">
        {/* Products Section */}
        <div className="col-span-2">
          <h2 className="text-lg font-medium text-white">Shopping Cart</h2>
          <ul role="list" className="mt-8 divide-y divide-white">
            {products.map((product) => (
              <li key={product.id} className="flex py-6">
                <div className="h-24 w-24 overflow-hidden rounded-md border border-white">
                  <img
                    alt={product.imageAlt}
                    src={product.imageSrc}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-white">
                      <h3>
                        <a href={product.href}>{product.name}</a>
                      </h3>
                      <p className="ml-4">{product.price}</p>
                    </div>
                    <p className="mt-1 text-sm text-white">{product.color}</p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <p className="text-white">Qty {product.quantity}</p>
                    <div className="flex">
                      <button
                        type="button"
                        className="font-medium text-white hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Order Summary Section */}
        <div className="col-span-1">
          <h2 className="text-lg font-medium text-white">Order Summary</h2>
          <div className="mt-4 border-t border-gray-200 py-4">
            <div className="flex justify-between text-base font-medium text-white">
              <p>Subtotal</p>
              <p>$262.00</p>
            </div>
            <p className="mt-0.5 text-sm text-white">
              Shipping and taxes calculated at checkout.
            </p>
          </div>
          <div className="mt-6">
            <a
              href="#"
              className="flex w-full items-center justify-center rounded-md border border-transparent bg-gray-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-500"
            >
              Checkout
            </a>
          </div>
          <div className="mt-6 flex justify-center text-center text-sm text-white">
            <p>
              or{" "}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-medium text-white hover:text-red-500"
              >
                Continue Shopping
                <span aria-hidden="true"> &rarr;</span>
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
