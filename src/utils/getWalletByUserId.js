import walletApi from "../api/walletApi";

export const getWalletByUserId = async () => {
  try {
    const response = await walletApi.getWallet();
    
    if (response?.isSuccess && response?.data) {
      // Get the user ID from local storage
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.userId;
      
      if (!userId) return null;
      
      // Find the wallet for this user
      const userWallet = response.data.find(
        (wallet) => wallet.userId === Number(userId)
      );
      
      return userWallet;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return null;
  }
};

export default getWalletByUserId;
