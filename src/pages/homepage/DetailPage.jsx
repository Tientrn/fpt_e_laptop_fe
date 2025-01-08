import React from "react";
import { useState } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { AttachMoney } from "@mui/icons-material";

const product = {
  name: "Dell XPS 15",
  price: "$1,499",
  href: "#",
  breadcrumbs: [
    { id: 1, name: "Electronics", href: "#" },
    { id: 2, name: "Laptops", href: "#" },
  ],
  images: [
    {
      src: "https://cdn.tgdd.vn/Products/Images/44/314837/dell-xps-15-9530-i7-71015716-3-750x500.jpg",
      alt: "Front view of Dell XPS 15.",
    },
    {
      src: "https://cdn.tgdd.vn/Products/Images/44/314837/dell-xps-15-9530-i7-71015716-2-750x500.jpg",
      alt: "Dell XPS 15 with keyboard and trackpad visible.",
    },
    {
      src: "https://cdn.tgdd.vn/Products/Images/44/314837/dell-xps-15-9530-i7-71015716-2-750x500.jpg",
      alt: "Dell XPS 15 from the side showing its slim design.",
    },
    {
      src: "https://cdn.tgdd.vn/Products/Images/44/314837/dell-xps-15-9530-i7-71015716-1-750x500.jpg",
      alt: "Close-up of Dell XPS 15 display with vibrant colors.",
    },
  ],
  colors: [
    { name: "Silver", class: "bg-gray-300", selectedClass: "ring-gray-400" },
    { name: "Black", class: "bg-gray-900", selectedClass: "ring-gray-900" },
  ],

  description:
    "The Dell XPS 15 is a high-performance laptop designed for professionals and creators. With a stunning 4K display, powerful Intel Core i7 processor, and ultra-slim design, it's perfect for productivity and entertainment.",
  highlights: [
    "Intel Core i7-12700H processor",
    "15.6-inch 4K UHD+ display",
    "16GB RAM and 512GB SSD",
    "Ultra-slim and lightweight design",
    "Battery life up to 10 hours",
  ],
  details:
    "This laptop comes with a premium aluminum chassis, a stunning edge-to-edge display, and top-tier performance. It's equipped with the latest Wi-Fi 6 technology for seamless connectivity and a backlit keyboard for comfortable typing in any lighting condition.",
};

const reviews = {
  href: "#",
  average: 4.7,
  totalCount: 245,
};

const reviewsdetail = [
  {
    name: "Nguyễn Minh Anh",
    avatar: "https://i.pravatar.cc/50?img=11",
    rating: 5,
    text: "Chiếc laptop này thật sự tuyệt vời. Mình sử dụng cho công việc văn phòng và cả giải trí, hiệu suất rất mượt mà và pin dùng được rất lâu!",
  },
  {
    name: "Trần Văn Hùng",
    avatar: "https://i.pravatar.cc/50?img=12",
    rating: 4,
    text: "Máy chạy ổn, thiết kế gọn nhẹ, rất tiện để mang đi học. Tuy nhiên, quạt tản nhiệt hơi ồn khi chạy các ứng dụng nặng.",
  },
  {
    name: "Phạm Thùy Linh",
    avatar: "https://i.pravatar.cc/50?img=13",
    rating: 5,
    text: "Mình rất hài lòng với chiếc laptop này, đặc biệt là màn hình đẹp và bàn phím gõ rất thoải mái. Phù hợp cho cả làm việc lẫn học tập!",
  },
  {
    name: "Lê Quốc Tuấn",
    avatar: "https://i.pravatar.cc/50?img=14",
    rating: 4,
    text: "Cấu hình mạnh, chạy tốt các phần mềm thiết kế nhưng quạt tản nhiệt cần được cải thiện thêm. Tổng thể rất ổn với mức giá này.",
  },
  {
    name: "Hoàng Thị Mai",
    avatar: "https://i.pravatar.cc/50?img=15",
    rating: 5,
    text: "Laptop chạy êm, thiết kế sang trọng và cực kỳ nhẹ, dễ dàng mang đi họp hoặc làm việc ngoài quán cà phê. Rất đáng mua!",
  },
];

const productrelated = [
  {
    id: 1,
    name: "Dell XPS 15",
    imageSrc:
      "https://th.bing.com/th/id/R.2099f61c5eed0a4a96aa53e61473d8bf?rik=oF18Annr2YpdGg&pid=ImgRaw&r=0",
    imageAlt: "Front view of Dell XPS 15.",
    price: "$1,499",
    color: "Silver",
  },
  {
    id: 2,
    name: "MacBook Pro 16-inch",
    imageSrc:
      "https://photos5.appleinsider.com/gallery/57189-116491-16-inch-MacBook-Pro-Space-Black-xl.jpg",
    imageAlt: "Front view of MacBook Pro 16-inch.",
    price: "$2,499",
    color: "Space Gray",
  },
  {
    id: 3,
    name: "ASUS ROG Zephyrus G14",
    imageSrc:
      "https://m.360buyimg.com/ceco/s1266x846_jfs/t1/84807/18/25730/173737/6233e70cEd74f41d5/ecff37a65300ea95.jpg",
    imageAlt: "Front view of ASUS ROG Zephyrus G14.",
    price: "$1,899",
    color: "Eclipse Gray",
  },
  {
    id: 4,
    name: "Lenovo ThinkPad X1 Carbon",
    imageSrc:
      "https://media.icdn.hu/content/entity/2018/08/46772/5d2837825f9d7x1-extreme-01.png",
    imageAlt: "Front view of Lenovo ThinkPad X1 Carbon.",
    price: "$1,699",
    color: "Black",
  },
  {
    id: 5,
    name: "HP Spectre x360 14",
    imageSrc:
      "https://th.bing.com/th/id/R.aa61535bd9842726d108057e3489cbc9?rik=9ELSG4ccAMNfjw&pid=ImgRaw&r=0",
    imageAlt: "Front view of HP Spectre x360 14.",
    price: "$1,599",
    color: "Nightfall Black",
  },
  {
    id: 6,
    name: "Acer Predator Helios 300",
    imageSrc:
      "https://th.bing.com/th/id/R.e4f2415ee4e49f8c7a0b1553e09f55cb?rik=CB2wWIY%2blk3uPQ&pid=ImgRaw&r=0",
    imageAlt: "Front view of Acer Predator Helios 300.",
    price: "$1,299",
    color: "Black",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DetailPage() {
  const [startIndex, setStartIndex] = useState(0);

  const moveLeft = () => {
    setStartIndex(
      (prevIndex) =>
        (prevIndex - 1 + productrelated.length) % productrelated.length
    );
  };

  const moveRight = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % productrelated.length);
  };

  // Lấy 4 sản phẩm bắt đầu từ `startIndex`
  const visibleProducts = [
    productrelated[(startIndex + 0) % productrelated.length],
    productrelated[(startIndex + 1) % productrelated.length],
    productrelated[(startIndex + 2) % productrelated.length],
  ];

  return (
    <div className="bg-black">
      <div className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol
            role="list"
            className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            {product.breadcrumbs.map((breadcrumb) => (
              <li key={breadcrumb.id}>
                <div className="flex items-center">
                  <a
                    href={breadcrumb.href}
                    className="mr-2 text-sm font-medium text-white"
                  >
                    {breadcrumb.name}
                  </a>
                  <svg
                    fill="currentColor"
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    aria-hidden="true"
                    className="h-5 w-4 text-white"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
            ))}
            <li className="text-sm">
              <a
                href={product.href}
                aria-current="page"
                className="font-medium text-white hover:text-red-500"
              >
                {product.name}
              </a>
            </li>
          </ol>
        </nav>

        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:max-w-7xl lg:grid lg:grid-cols-3 lg:gap-x-8 lg:gap-y-8 lg:px-8">
          {product.images.map((image, index) => (
            <img
              key={index}
              alt={image.alt}
              src={image.src}
              className={classNames(
                "rounded-lg object-cover",
                index === 0
                  ? "hidden size-full lg:block"
                  : index === 1 || index === 2
                  ? "hidden lg:grid lg:grid-cols-1 lg:gap-y-8"
                  : "aspect-[4/5] size-full sm:rounded-lg lg:aspect-auto"
              )}
            />
          ))}
        </div>
        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {product.name}
            </h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-white">
              {product.price}
            </p>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      aria-hidden="true"
                      className={classNames(
                        reviews.average > rating ? "text-white" : "text-white",
                        "size-5 shrink-0"
                      )}
                    />
                  ))}
                </div>
                <p className="sr-only">{reviews.average} out of 5 stars</p>
                <a
                  href={reviews.href}
                  className="ml-3 text-sm font-medium text-white hover:text-red-500"
                >
                  {reviews.totalCount} reviews
                </a>
              </div>
            </div>

            <form className="mt-10">
              <div className="flex items-center space-x-4">
                <label
                  htmlFor="quantity"
                  className="text-base font-medium text-white"
                >
                  Quantity:
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  defaultValue="1"
                  className="w-16 rounded-md border border-gray-300 px-3 py-2 text-center text-gray-700 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex space-x-4 mt-6">
                {/* Buy Now Button */}
                <button
                  type="button"
                  className=" flex flex-row items-center justify-center rounded-md border border-transparent bg-gray-700 px-4 py-2 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2  focus:ring-offset-2"
                >
                  <AttachMoney />
                  Buy now
                </button>

                {/* Add to Bag Button */}
                <button
                  type="submit"
                  className=" items-center justify-center rounded-md border border-transparent bg-gray-700 px-4 py-2 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2  focus:ring-offset-2"
                >
                  <AddShoppingCartIcon />
                  Add to bag
                </button>
              </div>
            </form>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-white">{product.description}</p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-medium text-white">Highlights</h3>

              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  {product.highlights.map((highlight) => (
                    <li key={highlight} className="text-white">
                      <span className="text-white">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-sm font-medium text-white">Details</h2>

              <div className="mt-4 space-y-6">
                <p className="text-sm text-white">{product.details}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black ">
        <div className="mx-auto max-w-2xl px-2 py-10 sm:px-6 sm:py-5 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Related Laptops
          </h2>

          <div className="relative mt-6 max-w-7xl">
            <div className="flex overflow-x-auto space-x-8">
              {visibleProducts.map((product) => (
                <div key={product.id} className="group relative w-72">
                  <div className="w-full h-80 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={product.imageSrc}
                      alt={product.imageAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-lg font-medium text-white">
                      {product.name}
                    </p>
                    <p className="text-sm font-medium text-gray-400">
                      {product.color}
                    </p>
                    <p className="mt-2 text-lg font-medium text-white">
                      {product.price}
                    </p>

                    <a
                      href={`/laptopdetail?id=${product.id}`}
                      className="mt-2 text-sm text-red-400 hover:text-red-600"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Buttons */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 flex items-center space-x-2">
              <button
                onClick={moveLeft}
                className="text-white bg-gray-600 hover:bg-gray-700 p-2 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 flex items-center space-x-2">
              <button
                onClick={moveRight}
                className="text-white bg-gray-600 hover:bg-gray-700 p-2 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* phần review */}
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="max-w-6xl mx-auto mt-20 bg-black">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Customer Reviews
          </h2>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Section */}
            <div className="flex-1 space-y-6">
              {/* Ratings Section */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="text-yellow-500 text-2xl flex items-center mr-4">
                    <span>★★★★☆</span>
                  </div>
                  <p className="text-white">
                    Based on <span className="font-bold">1624 reviews</span>
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    { stars: 5, percentage: 63 },
                    { stars: 4, percentage: 10 },
                    { stars: 3, percentage: 6 },
                    { stars: 2, percentage: 12 },
                    { stars: 1, percentage: 9 },
                  ].map((rating, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-white">{rating.stars} ★</span>
                      <div className="w-full h-2 bg-white rounded">
                        <div
                          className="h-full bg-yellow-500 rounded"
                          style={{ width: `${rating.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-white">{rating.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share Thoughts Section */}
              <div>
                <h3 className="font-bold text-lg mb-2">Share your thoughts</h3>
                <p className="text-white p-4">
                  If you’ve used this product, share your thoughts with other
                  customers
                </p>
                <button className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-red-700">
                  Write a review
                </button>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex-1 max-h-[450px] overflow-y-scroll space-y-8 ml-20 ">
              {reviewsdetail.map((review, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-bold text-white">{review.name}</h3>
                    <div className="text-yellow-500 flex">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                    <p className="text-white mt-1">{review.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
