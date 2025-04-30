import walletApi from "../api/walletApi";
import { jwtDecode } from "jwt-decode";

export const getWalletByUserId = async () => {
  try {
    
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found");
    }

    
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    console.log(userId);

    if (!userId) {
      throw new Error("UserId not found in token");
    }

    
    const response = await walletApi.getWallet();
    
    
    if (response && response.data && Array.isArray(response.data)) {
      
      const userIdNumber = parseInt(userId);
      
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
