"use client";

import { useEffect, useState } from "react";
import statisticSponerUserApi from "../../../api/statisticSponerUser";
import { motion } from "framer-motion";

export default function SponsorSection() {
  const [sponsors, setSponsors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await statisticSponerUserApi.getTopSponsor();
        if (response && response.isSuccess && Array.isArray(response.data)) {
          setSponsors(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch top sponsors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  // For debug
  useEffect(() => {
    console.log("Current sponsors state:", sponsors);
  }, [sponsors]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-full border-3 border-[#98c1d9]/30 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-t-3 border-[#ee6c4d] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get badge icon based on rank
  const getBadgeIcon = (index) => {
    switch (index) {
      case 0: // Gold - 1st place
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 text-[#ee6c4d]"
            fill="currentColor"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        );
      case 1: // Silver - 2nd place
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 text-[#98c1d9]"
            fill="currentColor"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        );
      case 2: // Bronze - 3rd place
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 text-[#3d5a80]"
            fill="currentColor"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        );
      default: // Regular - other places
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 text-[#293241]"
            fill="currentColor"
          >
            <path
              d="M12 2L14.85 8.4L22 9.16L16.7 14.05L18.18 21L12 17.34L5.82 21L7.3 14.05L2 9.16L9.15 8.4L12 2Z"
              opacity="0.5"
            />
          </svg>
        );
    }
  };

  // Get background color based on rank
  const getBackgroundColor = (index) => {
    switch (index) {
      case 0:
        return "from-[#ee6c4d]/10 to-[#ee6c4d]/5"; // 1st place
      case 1:
        return "from-[#98c1d9]/10 to-[#98c1d9]/5"; // 2nd place
      case 2:
        return "from-[#3d5a80]/10 to-[#3d5a80]/5"; // 3rd place
      default:
        return "from-gray-100 to-white"; // Others
    }
  };

  // Get text color based on rank
  const getTextColor = (index) => {
    switch (index) {
      case 0:
        return "text-[#ee6c4d]"; // 1st place
      case 1:
        return "text-[#98c1d9]"; // 2nd place
      case 2:
        return "text-[#3d5a80]"; // 3rd place
      default:
        return "text-gray-600"; // Others
    }
  };

  return (
    <div>
      {/* Featured Top 3 Sponsors - Compact, horizontal layout */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-6">
          {sponsors.slice(0, 3).map((sponsor, index) => {
            // Reorder to show 1st in the middle (larger), 2nd on left, 3rd on right
            const displayOrder = index === 0 ? 1 : index === 1 ? 0 : 2;
            const isFirst = displayOrder === 1;

            return (
              <motion.div
                key={sponsor.sponsorId}
                className={`relative ${
                  isFirst
                    ? "order-2 md:-mt-6 md:mb-0 mb-3"
                    : displayOrder === 0
                    ? "order-1"
                    : "order-3"
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: displayOrder * 0.1 }}
                viewport={{ once: true }}
              >
                <div
                  className={`relative bg-gradient-to-b ${getBackgroundColor(
                    index
                  )} rounded-xl shadow-md overflow-hidden ${
                    isFirst ? "md:scale-110 z-10" : ""
                  }`}
                >
                  {/* Top border accent */}
                  <div
                    className={`h-1 w-full ${
                      index === 0
                        ? "bg-[#ee6c4d]"
                        : index === 1
                        ? "bg-[#98c1d9]"
                        : "bg-[#3d5a80]"
                    }`}
                  ></div>

                  <div className="p-4">
                    {/* Medal and Rank */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1.5">
                        {getBadgeIcon(index)}
                        <span
                          className={`text-xs font-semibold ${getTextColor(
                            index
                          )}`}
                        >
                          {index === 0
                            ? "Top Sponsor"
                            : index === 1
                            ? "2nd Place"
                            : "3rd Place"}
                        </span>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0
                            ? "bg-[#ee6c4d]/10 text-[#ee6c4d]"
                            : index === 1
                            ? "bg-[#98c1d9]/10 text-[#98c1d9]"
                            : "bg-[#3d5a80]/10 text-[#3d5a80]"
                        }`}
                      >
                        {index + 1}
                      </div>
                    </div>

                    {/* Sponsor Name */}
                    <h3
                      className={`font-bold mb-1 line-clamp-1 ${
                        isFirst ? "text-lg" : "text-base"
                      }`}
                    >
                      {sponsor.sponsorName}
                    </h3>

                    {/* Contribution Amount */}
                    <div
                      className={`font-bold mb-1 ${getTextColor(index)} ${
                        isFirst ? "text-xl" : "text-lg"
                      }`}
                    >
                      {formatCurrency(sponsor.totalAmount)}
                    </div>
                  </div>
                </div>

                {/* Crown for 1st place - smaller */}
                {index === 0 && (
                  <motion.div
                    className="absolute -top-5 left-1/2 transform -translate-x-1/2"
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 10L7 5L12 10L17 5L21 10L17 14H7L3 10Z"
                        fill="#ee6c4d"
                      />
                      <path
                        d="M7 14V19H17V14"
                        stroke="#ee6c4d"
                        strokeWidth="2"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Other Sponsors - More compact row layout */}
      {sponsors.length > 3 && (
        <div className="mt-6">
          <h4 className="text-base font-medium text-[#293241] mb-3 px-2">
            Other Supporters
          </h4>
          <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm">
            {sponsors.slice(3).map((sponsor, index) => (
              <motion.div
                key={sponsor.sponsorId}
                className={`flex items-center justify-between py-2.5 px-3 ${
                  index < sponsors.slice(3).length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 + 0.3 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center">
                  <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-500 mr-2">
                    {index + 4}
                  </span>
                  <div>
                    <div className="font-medium text-sm">
                      {sponsor.sponsorName}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-[#3d5a80]">
                  {formatCurrency(sponsor.totalAmount)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
