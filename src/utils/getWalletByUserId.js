import walletApi from "../api/walletApi";
import { jwtDecode } from "jwt-decode";

export const getWalletByUserId = async () => {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found");
    }

    // Giải mã token để lấy userId
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    console.log(userId);

    if (!userId) {
      throw new Error("UserId not found in token");
    }

    // Gọi API để lấy danh sách ví
    const response = await walletApi.getWallet();
    
    // Kiểm tra và lọc ví theo userId
    if (response && response.data && Array.isArray(response.data)) {
      // Tìm ví của user hiện tại trong danh sách
      const userIdNumber = parseInt(userId);
      // Tìm wallet có userId khớp, đảm bảo so sánh cùng kiểu dữ liệu
      const userWallet = response.data.find(wallet => parseInt(wallet.userId) === userIdNumber);
      if (userWallet) {
        return userWallet;
      } else {
        console.warn("Wallet not found for userId:", userId);
        return null;
      }
    } else {
      throw new Error("Wallet data not found or invalid format");
    }
  } catch (error) {
    console.error("Error getting wallet by userId:", error);
    return null;
  }
};

export default getWalletByUserId;
