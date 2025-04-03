import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { format } from "date-fns";

// Đăng ký các components cần thiết cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Custom Select styled để phù hợp với phong cách minimalism
const CustomSelect = styled("select")({
  padding: "8px 12px",
  border: "1px solid #cbd5e1", // slate-300
  borderRadius: "4px",
  backgroundColor: "#fff",
  color: "#000",
  fontSize: "14px",
  outline: "none",
  "&:focus": {
    borderColor: "#d97706", // amber-600
    boxShadow: "0 0 0 2px rgba(217, 119, 6, 0.2)", // focus ring amber-600
  },
});

const Statistics = () => {
  const [timeRange, setTimeRange] = useState("semester"); // 'semester' hoặc 'year'
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // Hàm lấy dữ liệu thống kê từ API
  const fetchStatistics = async (range) => {
    try {
      // TODO: Thay thế bằng API call thực tế
      const mockData =
        range === "semester"
          ? {
              labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4"],
              revenue: [1200000, 1500000, 1800000, 2000000],
              borrowCount: [45, 52, 60, 58],
            }
          : {
              labels: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
              revenue: [4500000, 5200000, 4800000, 6000000],
              borrowCount: [157, 180, 165, 190],
            };

      setChartData({
        labels: mockData.labels,
        datasets: [
          {
            label: "Doanh thu (VNĐ)",
            data: mockData.revenue,
            backgroundColor: "rgba(217, 119, 6, 0.5)", // amber-600 với opacity
            borderColor: "#d97706", // amber-600
            borderWidth: 1,
            yAxisID: "y",
          },
          {
            label: "Số lượt mượn",
            data: mockData.borrowCount,
            backgroundColor: "rgba(100, 116, 139, 0.5)", // slate-600 với opacity
            borderColor: "#64748b", // slate-600
            borderWidth: 1,
            yAxisID: "y1",
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  useEffect(() => {
    fetchStatistics(timeRange);
  }, [timeRange]);

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Doanh thu (VNĐ)",
          color: "#000", // chữ đen
          font: { size: 12 },
        },
        grid: {
          color: "#e2e8f0", // slate-200
        },
        ticks: {
          color: "#000", // chữ đen
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Số lượt mượn",
          color: "#000", // chữ đen
          font: { size: 12 },
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: "#000", // chữ đen
        },
      },
      x: {
        ticks: {
          color: "#000", // chữ đen
        },
        grid: {
          color: "#e2e8f0", // slate-200
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Thống kê doanh thu và số lượt mượn",
        color: "#000", // chữ đen
        font: { size: 16 },
      },
      legend: {
        labels: {
          color: "#000", // chữ đen
        },
      },
      tooltip: {
        backgroundColor: "#64748b", // slate-600
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header with Staff Role Indicator */}
      <div className="mb-6">
        <Typography
          variant="h5"
          component="h1"
          sx={{ color: "#000", fontWeight: 600 }}
        >
          Statistics
        </Typography>
        <span className="text-sm text-amber-600 font-medium">
          Staff Dashboard
        </span>
      </div>

      {/* Chart Container */}
      <Box className="bg-white border border-slate-200 rounded-md shadow-sm p-6">
        <Box className="flex justify-between items-center mb-4">
          <Typography
            variant="h6"
            component="h2"
            sx={{ color: "#000", fontWeight: 500 }}
          >
            Revenue and Borrow Statistics
          </Typography>
          <CustomSelect
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="semester">Theo học kỳ</option>
            <option value="year">Theo năm</option>
          </CustomSelect>
        </Box>
        <Box sx={{ height: 400 }}>
          <Bar options={options} data={chartData} />
        </Box>
      </Box>
    </div>
  );
};

export default Statistics;
