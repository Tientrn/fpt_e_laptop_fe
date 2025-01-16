import React from "react";

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

const Review = () => {
  return (
    <div className="min-h-screen flex items-center justify-center mb-8">
      <div className="max-w-screen-lg mx-auto mt-20 bg-gradient-to-br from-white to-teal-50/30 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-8 text-teal-800">
          Customer Reviews
        </h2>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section */}
          <div className="flex-1 space-y-8">
            {/* Ratings Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="text-teal-500 text-2xl flex items-center mr-4">
                  <span>★★★★☆</span>
                </div>
                <p className="text-teal-700">
                  Based on <span className="font-bold">1624 reviews</span>
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { stars: 5, percentage: 63 },
                  { stars: 4, percentage: 10 },
                  { stars: 3, percentage: 6 },
                  { stars: 2, percentage: 12 },
                  { stars: 1, percentage: 9 },
                ].map((rating, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-teal-600 min-w-[40px]">
                      {rating.stars} ★
                    </span>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${rating.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-teal-600 min-w-[40px]">
                      {rating.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Share Thoughts Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-teal-800">
                Share your thoughts
              </h3>
              <p className="text-teal-600 mb-4">
                If you've used this product, share your thoughts with other
                customers
              </p>
              <button
                className="px-6 py-2.5 bg-teal-600 text-white rounded-lg
                hover:bg-teal-700 transition-all duration-300
                hover:shadow-lg hover:scale-105 active:scale-100
                flex items-center space-x-2 group"
              >
                <span>Write a review</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Section - Reviews List */}
          <div className="flex-1 bg-white p-6 rounded-xl shadow-sm">
            <div
              className="max-h-[600px] overflow-y-auto space-y-6 pr-4 
              scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-gray-100"
            >
              {reviewsdetail.map((review, index) => (
                <div
                  key={index}
                  className="flex space-x-4 p-4 rounded-lg hover:bg-teal-50 transition-colors"
                >
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full ring-2 ring-teal-500/20"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-teal-800">{review.name}</h3>
                    <div className="text-teal-500 flex my-1">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                    <p className="text-teal-600 text-sm">{review.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
