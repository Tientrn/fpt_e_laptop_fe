import React, { useState, useEffect } from 'react';
import {
  Bar
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { 
  FormControl, 
  Select, 
  MenuItem, 
  Box,
  Typography,
  Paper
} from '@mui/material';
import { format } from 'date-fns';

// Đăng ký các components cần thiết cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const [timeRange, setTimeRange] = useState('semester'); // 'semester' hoặc 'year'
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  // Hàm lấy dữ liệu thống kê từ API
  const fetchStatistics = async (range) => {
    try {
      // TODO: Thay thế bằng API call thực tế
      // Dữ liệu mẫu
      const mockData = range === 'semester' 
        ? {
            labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4'],
            revenue: [1200000, 1500000, 1800000, 2000000],
            borrowCount: [45, 52, 60, 58]
          }
        : {
            labels: ['Quý 1', 'Quý 2', 'Quý 3', 'Quý 4'],
            revenue: [4500000, 5200000, 4800000, 6000000],
            borrowCount: [157, 180, 165, 190]
          };

      setChartData({
        labels: mockData.labels,
        datasets: [
          {
            label: 'Doanh thu (VNĐ)',
            data: mockData.revenue,
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            borderColor: 'rgb(53, 162, 235)',
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            label: 'Số lượt mượn',
            data: mockData.borrowCount,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1,
            yAxisID: 'y1'
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    fetchStatistics(timeRange);
  }, [timeRange]);

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Doanh thu (VNĐ)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Số lượt mượn'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Thống kê doanh thu và số lượt mượn sách',
        font: {
          size: 16
        }
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2">
            Thống kê
          </Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              size="small"
            >
              <MenuItem value="semester">Theo học kỳ</MenuItem>
              <MenuItem value="year">Theo năm</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ height: 400 }}>
          <Bar options={options} data={chartData} />
        </Box>
      </Paper>
    </Box>
  );
};

export default Statistics;