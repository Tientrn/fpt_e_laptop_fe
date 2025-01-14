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
    <div className=" min-h-screen flex items-center justify-center mb-8">
      <div className="max-w-screen-lg mx-auto mt-20 bg-white ">
        <h2 className="text-2xl font-bold mb-6 mx-32">Customer Reviews</h2>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section */}
          <div className="flex-1 space-y-6">
            {/* Ratings Section */}
            <div>
              <div className="flex items-center mb-4">
                <div className="text-yellow-500 text-2xl flex items-center mr-4">
                  <span>★★★★☆</span>
                </div>
                <p>
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
                    <span>{rating.stars} ★</span>
                    <div className="w-full h-2 bg-white rounded">
                      <div
                        className="h-full bg-yellow-500 rounded"
                        style={{ width: `${rating.percentage}%` }}
                      ></div>
                    </div>
                    <span>{rating.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Share Thoughts Section */}
            <div>
              <h3 className="font-bold text-lg mb-2">Share your thoughts</h3>
              <p className=" p-4">
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
                  <h3 className="font-bold ">{review.name}</h3>
                  <div className="text-yellow-500 flex">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>
                  <p className=" mt-1">{review.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
