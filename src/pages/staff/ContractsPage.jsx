import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import borrowcontractApi from "../../api/borrowcontractApi";
import borrowrequestApi from "../../api/borrowrequestApi";
import donateitemsApi from "../../api/donateitemsApi";
import userApi from "../../api/userApi";
import deposittransactionApi from "../../api/deposittransactionApi";
import borrowhistoryApi from "../../api/borrowhistoryApi";
import {
  validateMoneyBeforeSubmit,
  handleMoneyInputChange,
  formatCurrency,
  calculateMinimumDeposit,
  calculateMaximumDeposit,
  validateDeposit,
} from "../../utils/moneyValidationUtils";
import axiosClient from "../../api/axiosClient";

const ContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [contractForm, setContractForm] = useState({
    requestId: 0,
    itemId: 0,
    terms: "",
    conditionBorrow: "",
    itemValue: 1000000,
    expectedReturnDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
  });
  const [userInfoMap, setUserInfoMap] = useState({});
  const [deposits, setDeposits] = useState({});
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // "all", "requests", "active"
  const [searchTerm, setSearchTerm] = useState("");
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedContractForDeposit, setSelectedContractForDeposit] =
    useState(null);
  const [depositForm, setDepositForm] = useState({
    contractId: 0,
    userId: 0,
    status: "Pending",
    amount: 0,
    depositDate: new Date().toISOString(),
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchContracts(),
        fetchApprovedRequests(),
        fetchDeposits(),
      ]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Contracts:", contracts);
    console.log("Approved Requests:", approvedRequests);
    console.log("User Info Map:", userInfoMap);
    console.log("Deposits:", deposits);
  }, [contracts, approvedRequests, userInfoMap, deposits]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      for (const contract of contracts) {
        try {
          // Get request details first
          const requestResponse = await borrowrequestApi.getBorrowRequestById(
            contract.requestId
          );
          if (requestResponse.isSuccess) {
            // Then get user info using userId from the request
            const userResponse = await userApi.getUserById(
              requestResponse.data.userId
            );
            if (userResponse.isSuccess) {
              setUserInfoMap((prev) => ({
                ...prev,
                [contract.contractId]: userResponse.data,
              }));
            }
          }
        } catch (error) {
          console.error(
            `Error fetching user info for contract ${contract.contractId}:`,
            error
          );
        }
      }
    };

    if (contracts.length > 0) {
      fetchUserInfo();
    }
  }, [contracts]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await borrowcontractApi.getAllBorrowContracts();
      if (response.isSuccess) {
        setContracts(response.data || []);

        // Fetch user info for borrowers (students)
        const borrowerIds = [
          ...new Set(response.data.map((contract) => contract.userId)),
        ];
        await fetchUserInfoForIds(borrowerIds);
      } else {
        toast.error("Failed to load contracts");
      }
    } catch (error) {
      console.error("Error loading contracts:", error);
      toast.error("Error loading contracts");
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedRequests = async () => {
    try {
      const [requestResponse, contractResponse] = await Promise.all([
        borrowrequestApi.getAllBorrowRequests(),
        borrowcontractApi.getAllBorrowContracts(),
      ]);

      if (requestResponse.isSuccess && contractResponse.isSuccess) {
        const existingContractRequestIds = contractResponse.data.map(
          (contract) => contract.requestId
        );

        console.log(requestResponse.data);
        // Lọc ra các request có status "Approved" và chưa có contract
        const approved = requestResponse.data.filter(
          (request) =>
            request.status === "Approved" &&
            !existingContractRequestIds.includes(request.requestId)
        );

        setApprovedRequests(approved);

        // Fetch user info cho các approved requests
        const userIds = [...new Set(approved.map((request) => request.userId))];
        await fetchUserInfoForIds(userIds);
      }
    } catch (error) {
      console.error("Error fetching approved requests:", error);
      toast.error("Failed to load approved requests");
    }
  };

  const fetchUserInfoForIds = async (userIds) => {
    try {
      for (const userId of userIds) {
        if (!userInfoMap[userId]) {
          const response = await userApi.getUserById(userId);
          if (response.isSuccess) {
            setUserInfoMap((prev) => ({
              ...prev,
              [userId]: response.data,
            }));
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchDeposits = async () => {
    try {
      const response = await deposittransactionApi.getAllDepositTransactions();
      if (response.isSuccess) {
        const depositsMap = response.data.reduce((acc, deposit) => {
          acc[deposit.contractId] = {
            ...deposit,
            status: deposit.status || "Completed", // <- Đây là vấn đề
          };
          return acc;
        }, {});
        setDeposits(depositsMap);
      }
    } catch (error) {
      console.error("Error fetching deposits:", error);
      toast.error("Failed to load deposits");
    }
  };

  const handleRequestSelect = async (request) => {
    console.log("Selected Request:", request);
    toast.info(
      `Processing request #${request.requestId} for ${request.itemName}`
    );

    try {
      // Fetch user information when selecting a request
      toast.info("Loading user details...");
      const userResponse = await userApi.getUserById(request.userId);
      if (userResponse.isSuccess) {
        setSelectedUserInfo(userResponse.data);
        toast.success(
          `User details for ${userResponse.data.fullName} loaded successfully`
        );
      } else {
        toast.warning("Could not load user details, but you can continue");
      }

      // Validate and set default date to the request's start date
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      const today = new Date();

      // Choose default return date as startDate
      let defaultReturnDate = new Date(startDate);

      // If startDate has passed, set default to today
      if (startDate < today) {
        defaultReturnDate = today;
        toast.info("Start date has passed, setting return date to today");
      }

      // Ensure default date doesn't exceed endDate
      if (defaultReturnDate > endDate) {
        defaultReturnDate = endDate;
        toast.info("Adjusting return date to match maximum allowed date");
      }

      toast.info("Preparing contract form...");
      // Reset form and set new values
      setContractForm({
        requestId: request.requestId,
        itemId: request.itemId,
        itemValue: 1000000,
        terms: `Contract for ${request.itemName}`,
        conditionBorrow: "good",
        expectedReturnDate: defaultReturnDate.toISOString().split("T")[0],
        userId: parseInt(request.userId),
      });

      // Set selected request
      setSelectedRequest(request);

      // Open modal
      setIsModalOpen(true);
      toast.success(
        "Ready to create contract. Please fill in the remaining details."
      );
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error(
        "Failed to load user details: " +
          (error.response?.data?.message || error.message || "Unknown error")
      );
    }
  };

  const handleExpectedReturnDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const startDate = new Date(selectedRequest.startDate);
    const endDate = new Date(selectedRequest.endDate);

    if (selectedDate >= startDate && selectedDate <= endDate) {
      setContractForm({
        ...contractForm,
        expectedReturnDate: e.target.value,
      });
    } else {
      toast.error("Selected date must be between start date and end date");
      // Reset về ngày hợp lệ gần nhất
      if (selectedDate < startDate) {
        setContractForm({
          ...contractForm,
          expectedReturnDate: selectedRequest.startDate.split("T")[0],
        });
      } else if (selectedDate > endDate) {
        setContractForm({
          ...contractForm,
          expectedReturnDate: selectedRequest.endDate.split("T")[0],
        });
      }
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    // Validate file size and type
    const validFiles = files.filter((file) => {
      const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(
        file.type
      );
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

      if (!isValidType) {
        toast.error(
          `${file.name} is not a valid image format. Only JPG and PNG are allowed.`
        );
      }
      if (!isValidSize) {
        toast.error(`${file.name} exceeds the 5MB size limit.`);
      }

      return isValidType && isValidSize;
    });

    setSelectedImages(validFiles);
  };

  const handleUploadContractImages = async (contractId) => {
    if (selectedImages.length === 0) {
      toast.error("Please select at least one image to upload");
      return;
    }

    toast.info(
      `Preparing to upload ${selectedImages.length} image${
        selectedImages.length !== 1 ? "s" : ""
      }...`
    );
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedImageUrls = [];
      const totalImages = selectedImages.length;

      for (let i = 0; i < totalImages; i++) {
        const file = selectedImages[i];
        const formData = new FormData();
        formData.append("ImageBorrowConract", file);
        formData.append("BorrowContractId", contractId);

        toast.info(`Uploading image ${i + 1} of ${totalImages}: ${file.name}`);

        try {
          const response = await axiosClient.post(
            `BorrowContract/upload-image/${contractId}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent) => {
                const fileProgress = progressEvent.loaded / progressEvent.total;
                const overallProgress = Math.round(
                  ((i + fileProgress) / totalImages) * 100
                );
                setUploadProgress(overallProgress);
              },
            }
          );

          // The API returns data: null on success, so we need to construct the image URL ourselves
          if (response.isSuccess) {
            // Generate a predictable URL based on the contract ID and file name
            // or use a timestamp to ensure uniqueness
            const timestamp = new Date().getTime();
            const imageUrl = `/contract-images/${contractId}/${file.name}?t=${timestamp}`;
            uploadedImageUrls.push(imageUrl);
            toast.success(`Image ${i + 1} uploaded successfully`);
          } else {
            toast.warning(
              `Image ${i + 1} upload failed: ${
                response.message || "Unknown error"
              }`
            );
          }
        } catch (fileError) {
          toast.error(`Failed to upload image ${i + 1}: ${file.name}`);
          console.error(`Error uploading image ${i + 1}:`, fileError);
        }
      }

      if (uploadedImageUrls.length > 0) {
        toast.success(
          `Successfully uploaded ${uploadedImageUrls.length} of ${totalImages} images`
        );

        // First force reload the full contract data to get the new images
        await forceReloadContract(contractId);

        // Clear the selected images since they've been uploaded
        setSelectedImages([]);
      } else {
        toast.error("Failed to upload any images. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading contract images:", error);
      toast.error(`Upload process error: ${error.message || "Unknown error"}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // New function to handle multiple attempts to reload contract data
  const forceReloadContract = async (contractId) => {
    toast.info("Reloading contract data with new images...");

    // Make multiple attempts with increasing delays
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        // Add increasing delay between attempts
        const delay = attempt * 1000; // 1s, 2s, 3s
        toast.info(
          `Attempt ${attempt}/3: Waiting ${
            delay / 1000
          }s for server processing...`
        );

        await new Promise((resolve) => setTimeout(resolve, delay));

        // Close and reopen the modal to trigger a complete refresh
        setIsDetailModalOpen(false);

        // Small delay before reopening
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Fetch updated contracts list
        await fetchContracts();

        // Find the contract in the updated list
        const updatedContract = contracts.find(
          (c) => c.contractId === contractId
        );

        if (updatedContract) {
          // Reopen the modal with the updated contract
          handleDetailClick(updatedContract);
          toast.success("Contract refreshed successfully with new images");
          return true;
        }
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
      }
    }

    // If we reached here, all attempts failed
    toast.warning(
      "Could not refresh contract data automatically. Please close and reopen contract details to see new images."
    );
    return false;
  };

  const fetchContractDetails = async (contractId) => {
    try {
      toast.info("Refreshing contract details from server...");

      // Get the contract with updated images
      const contractResponse = await borrowcontractApi.getBorrowContractById(
        contractId
      );

      if (!contractResponse?.isSuccess) {
        console.error("Contract response error:", contractResponse);
        toast.error("Failed to get updated contract details");
        return false;
      }

      console.log("Received contract data:", contractResponse.data);

      // Only proceed if contract data has the needed properties
      if (!contractResponse.data || !contractResponse.data.requestId) {
        toast.error("Contract data is incomplete");
        return false;
      }

      // Get the request information associated with the contract
      const requestResponse = await borrowrequestApi.getBorrowRequestById(
        contractResponse.data.requestId
      );

      if (!requestResponse?.isSuccess) {
        toast.error("Failed to load updated request details");
        return false;
      }

      // Update the selected contract with the new data including images
      setSelectedContract({
        ...contractResponse.data,
        requestDetails: requestResponse.data,
      });

      toast.success("Contract details updated successfully");
      return true;
    } catch (error) {
      console.error("Error fetching updated contract details:", error);
      toast.error(
        "Failed to refresh contract details: " +
          (error.message || "Unknown error")
      );
      return false;
    }
  };

  const handleCreateContract = async (e) => {
    e.preventDefault();
    try {
      // Validate monetary values
      toast.info("Validating form data...");

      if (!contractForm.itemValue || contractForm.itemValue <= 0) {
        toast.error("Please enter a valid item value (greater than 0)");
        return;
      }

      const isValid = validateMoneyBeforeSubmit(
        {
          itemValue: { value: contractForm.itemValue, label: "item value" },
        },
        toast.error
      );

      if (!isValid) {
        return;
      }

      if (!contractForm.terms.trim()) {
        toast.error("Please enter contract terms");
        return;
      }

      if (!contractForm.conditionBorrow.trim()) {
        toast.error("Please enter item condition at borrow time");
        return;
      }

      if (!contractForm.expectedReturnDate) {
        toast.error("Please select an expected return date");
        return;
      }

      // Validate return date is within range
      const returnDate = new Date(contractForm.expectedReturnDate);
      const startDate = new Date(selectedRequest.startDate);
      const endDate = new Date(selectedRequest.endDate);

      if (returnDate < startDate || returnDate > endDate) {
        toast.error(
          `Return date must be between ${format(
            startDate,
            "dd/MM/yyyy"
          )} and ${format(endDate, "dd/MM/yyyy")}`
        );
        return;
      }

      toast.info("Preparing contract data...");
      const contractData = {
        requestId: parseInt(contractForm.requestId),
        itemId: parseInt(contractForm.itemId),
        itemValue: parseInt(contractForm.itemValue),
        conditionBorrow: contractForm.conditionBorrow || "good",
        terms: contractForm.terms,
        expectedReturnDate: format(
          new Date(contractForm.expectedReturnDate),
          "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
        ),
        userId: parseInt(selectedRequest.userId), // Ensure we're using the correct userId from the selected request
      };

      console.log("Submitting contract data:", contractData);
      toast.info("Creating contract...");

      const response = await borrowcontractApi.createBorrowContract(
        contractData
      );

      if (response.isSuccess) {
        toast.success("Contract created successfully!");

        if (selectedImages.length > 0) {
          toast.info(`Uploading ${selectedImages.length} contract images...`);
          try {
            await handleUploadContractImages(response.data.contractId);
            toast.success("Contract images uploaded successfully");
          } catch (uploadError) {
            console.error("Upload error:", uploadError);
            toast.error("Failed to upload images, but contract was created");
          }
        }

        setIsModalOpen(false);

        // Refresh data
        toast.info("Refreshing contract data...");
        await Promise.all([
          fetchContracts(),
          fetchApprovedRequests(),
          fetchDeposits(),
        ]);
        toast.success("Data refreshed successfully");

        // Reset form
        setContractForm({
          requestId: 0,
          itemId: 0,
          terms: "",
          conditionBorrow: "",
          itemValue: 1000000,
          expectedReturnDate: format(new Date(), "yyyy-MM-dd"),
        });

        toast.info("Ready to create new contracts or deposits");
      } else {
        toast.error(response.message || "Failed to create contract");
      }
    } catch (error) {
      console.error("Error creating contract:", error);
      toast.error(
        "Error creating contract: " +
          (error.response?.data?.message || error.message || "Unknown error")
      );
    }
  };

  const handleDeleteContract = async (contract) => {
    try {
      toast.info("Preparing to delete contract #" + contract.contractId);

      // Check for associated deposit
      if (deposits[contract.contractId]) {
        toast.info("Deleting associated deposit transaction first...");
        const deleteDepositResponse =
          await deposittransactionApi.deleteDepositTransaction(
            deposits[contract.contractId].depositId
          );
        if (!deleteDepositResponse.isSuccess) {
          toast.error(
            "Failed to delete associated deposit: " +
              (deleteDepositResponse.message || "Unknown error")
          );
          return;
        }
        toast.success("Associated deposit deleted successfully");
      }

      // Delete the contract
      toast.info("Deleting contract...");
      const response = await borrowcontractApi.deleteBorrowContract(
        contract.contractId
      );
      if (response.isSuccess) {
        toast.success("Contract deleted successfully");

        toast.info("Refreshing data...");
        await Promise.all([fetchContracts(), fetchDeposits()]);
        toast.success("Data refreshed successfully");

        setIsDeleteModalOpen(false);
      } else {
        toast.error(response.message || "Failed to delete contract");
      }
    } catch (error) {
      console.error("Error deleting contract:", error);
      toast.error(
        "Error deleting contract: " +
          (error.response?.data?.message || error.message || "Unknown error")
      );
    }
  };

  const handleDetailClick = async (contract) => {
    try {
      toast.info("Loading contract details...");
      setIsDetailModalOpen(true); // Open modal immediately to improve perceived loading speed
      setSelectedImages([]);

      // Set initial data to show loading state
      setSelectedContract({
        ...contract,
        isLoading: true,
      });

      // Get the contract with images
      const contractResponse = await borrowcontractApi.getBorrowContractById(
        contract.contractId
      );

      if (!contractResponse?.isSuccess) {
        toast.error("Failed to get contract details");
        return;
      }

      // Log contract data for debugging
      console.log("Contract data received:", contractResponse.data);

      // Get the request information associated with the contract
      const response = await borrowrequestApi.getBorrowRequestById(
        contract.requestId
      );

      // Get donate item details để lấy Serial Number
      const donateItemResponse = await donateitemsApi.getDonateItemById(
        contract.itemId
      );

      if (response?.isSuccess) {
        // Remove loading state and set full contract data
        setSelectedContract({
          ...contractResponse.data,
          requestDetails: response.data,
          serialNumber: donateItemResponse?.isSuccess
            ? donateItemResponse.data.serialNumber
            : "Unknown",
          isLoading: false,
        });
        toast.success("Contract details loaded successfully");
      } else {
        toast.error(
          "Failed to load request details: " +
            (response?.message || "Unknown error")
        );
        setSelectedContract((prev) => ({
          ...prev,
          isLoading: false,
          loadError: true,
        }));
      }
    } catch (error) {
      console.error("Error fetching contract details:", error);
      toast.error(
        "Failed to load contract details: " + (error.message || "Unknown error")
      );
      setSelectedContract((prev) => ({
        ...prev,
        isLoading: false,
        loadError: true,
      }));
    }
  };

  // Modified isExpiringSoon function to add warning badge to item details instead
  const isExpiringSoon = (date) => {
    const returnDate = new Date(date);
    const today = new Date();
    const diffTime = returnDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  // Filtered contracts and requests based on active tab and search term
  const filteredData = () => {
    let result = [];

    if (activeTab === "requests" || activeTab === "all") {
      const filteredRequests = approvedRequests

        .filter((request) =>
          searchTerm
            ? userInfoMap[request.userId]?.fullName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              userInfoMap[request.userId]?.email
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              request.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
            : true
        )
        .sort((a, b) => b.requestId - a.requestId)
        .map((request) => ({
          ...request,
          isRequest: true,
        }));

      if (activeTab === "requests") {
        return filteredRequests;
      }

      result = [...filteredRequests];
    }

    if (activeTab === "active" || activeTab === "all") {
      const filteredContracts = contracts
        .filter((contract) =>
          searchTerm
            ? userInfoMap[contract.contractId]?.fullName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              userInfoMap[contract.contractId]?.email
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
            : true
        )
        .sort((a, b) => b.contractId - a.contractId)
        .map((contract) => ({
          ...contract,
          isContract: true,
        }));

      if (activeTab === "active") {
        return filteredContracts;
      }

      result = [...result, ...filteredContracts];
    }

    return result;
  };

  const handleCreateDeposit = async (e) => {
    e.preventDefault();
    try {
      const contractValue = selectedContractForDeposit?.itemValue || 0;

      // Input validation - show toast for empty values
      if (!depositForm.amount) {
        toast.error("Please enter a deposit amount");
        return;
      }

      // Validate deposit amount range
      const minValue = calculateMinimumDeposit(contractValue);
      const maxValue = contractValue;

      if (depositForm.amount < minValue) {
        toast.error(
          `Deposit amount is too low. Minimum required: ${formatCurrency(
            minValue
          )}`
        );
        return;
      }

      if (depositForm.amount > maxValue) {
        toast.error(
          `Deposit amount exceeds item value. Maximum allowed: ${formatCurrency(
            maxValue
          )}`
        );
        return;
      }

      // Validate deposit using the enhanced deposit validation
      const depositValidation = validateDeposit(
        depositForm.amount,
        contractValue
      );

      if (!depositValidation.isValid) {
        toast.error(depositValidation.error);
        return;
      }

      // Additional validation of money fields
      const isValid = validateMoneyBeforeSubmit(
        {
          amount: {
            value: depositForm.amount,
            label: "deposit amount",
            min: calculateMinimumDeposit(contractValue),
            max: contractValue,
          },
        },
        toast.error
      );

      if (!isValid) {
        return;
      }

      toast.info("Retrieving contract details...");

      // Get contract and request details
      const contractResponse = await borrowcontractApi.getBorrowContractById(
        depositForm.contractId
      );
      if (!contractResponse.isSuccess) {
        toast.error("Failed to get contract details");
        return;
      }

      const contract = contractResponse.data;
      toast.info("Contract details retrieved successfully");

      // Get request details
      const requestResponse = await borrowrequestApi.getBorrowRequestById(
        contract.requestId
      );
      if (!requestResponse.isSuccess) {
        toast.error("Failed to get request details");
        return;
      }

      const request = requestResponse.data;
      toast.info("Request details retrieved successfully");

      const depositData = {
        contractId: parseInt(depositForm.contractId),
        userId: parseInt(contract.userId),
        status: depositForm.status,
        amount: parseInt(depositForm.amount),
        depositDate: depositForm.depositDate,
      };

      console.log("Submitting deposit data:", depositData);
      toast.info("Creating deposit transaction...");

      const response = await deposittransactionApi.createDepositTransaction(
        depositData
      );
      console.log(response);
      if (response.isSuccess) {
        toast.success("Deposit transaction created successfully");

        // After successful deposit, create borrow history
        try {
          toast.info("Creating borrow history record...");

          const historyData = {
            requestId: parseInt(contract.requestId),
            itemId: parseInt(contract.itemId),
            userId: parseInt(contract.userId),
            borrowDate: request.startDate,
            returnDate: contract.expectedReturnDate,
            status: "Pending",
          };

          console.log("Creating borrow history:", historyData);
          const historyResponse = await borrowhistoryApi.createBorrowHistory(
            historyData
          );

          if (historyResponse?.isSuccess) {
            toast.success("Borrow history created successfully");
          } else {
            toast.error(
              historyResponse?.message || "Failed to create borrow history"
            );
          }
        } catch (historyError) {
          console.error("Error creating borrow history:", historyError);
          toast.error(
            "Error creating borrow history: " +
              (historyError.message || "Unknown error")
          );
        }

        setIsDepositModalOpen(false);

        // Refresh deposits data
        toast.info("Refreshing deposit data...");
        await fetchDeposits();
        toast.success("Data refreshed successfully");

        // Reset form
        setDepositForm({
          contractId: 0,
          userId: 0,
          status: "Pending",
          amount: 0,
          depositDate: new Date().toISOString(),
        });
      } else {
        toast.error(response.message || "Failed to create deposit transaction");
      }
    } catch (error) {
      console.error("Error creating deposit:", error);
      toast.error(
        "Error creating deposit: " +
          (error.response?.data?.message || error.message || "Unknown error")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with Staff Role Indicator */}
      <div className="mb-8">
        <h1 className="text-3xl text-center font-bold text-gray-800">
          Contract Management
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Manage all contracts and requests in one place
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8 bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === "all"
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === "requests"
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Requests
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === "active"
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Contracts
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by name, email, item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border-0 bg-gray-100 rounded-lg focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            />
            <div className="absolute right-3 top-2.5 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Combined Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {activeTab === "requests"
              ? "Approved Requests"
              : activeTab === "active"
              ? "Active Contracts"
              : "All Contracts & Requests"}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({filteredData().length} items)
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-gray-600 to-amber-600 text-white">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Item Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredData().length > 0 ? (
                  filteredData().map((item) => (
                    <tr
                      key={
                        item.isRequest
                          ? `request-${item.requestId}`
                          : `contract-${item.contractId}`
                      }
                      className={`hover:bg-gray-50 transition-colors ${
                        item.isContract &&
                        isExpiringSoon(item.expectedReturnDate)
                          ? "bg-red-50"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {item.isRequest
                              ? userInfoMap[item.userId]?.fullName ||
                                "Loading..."
                              : userInfoMap[item.contractId]?.fullName ||
                                "Loading..."}
                          </span>
                          <span className="text-sm text-gray-500">
                            {item.isRequest
                              ? userInfoMap[item.userId]?.email || "Loading..."
                              : userInfoMap[item.contractId]?.email ||
                                "Loading..."}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.isRequest ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {item.itemName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {format(new Date(item.startDate), "dd/MM/yyyy")}{" "}
                              to {format(new Date(item.endDate), "dd/MM/yyyy")}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-900">
                                Value: {formatCurrency(item.itemValue || 0)}
                              </span>
                              {isExpiringSoon(item.expectedReturnDate) && (
                                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                  Due Soon
                                </span>
                              )}
                            </div>
                            {item.itemName && (
                              <span className="text-xs text-gray-500">
                                {item.itemName}
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              Due:{" "}
                              {format(
                                new Date(item.expectedReturnDate),
                                "dd/MM/yyyy"
                              )}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.isRequest ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Pending Contract
                          </span>
                        ) : (
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              deposits[item.contractId]
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {deposits[item.contractId]
                              ? "Active"
                              : "Pending Deposit"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {item.isRequest ? (
                          <button
                            onClick={() => handleRequestSelect(item)}
                            className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-sm"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            Create Contract
                          </button>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDetailClick(item)}
                              className="inline-flex items-center px-2.5 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-sm"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>
                            {!deposits[item.contractId] ? (
                              <button
                                onClick={() => {
                                  setSelectedContractForDeposit(item);
                                  setDepositForm({
                                    contractId: item.contractId,
                                    userId: item.userId,
                                    status: "Pending",
                                    amount: Math.round(item.itemValue * 0.1), // Default to 10% of item value
                                    depositDate: new Date().toISOString(),
                                  });
                                  setIsDepositModalOpen(true);
                                }}
                                className="inline-flex items-center px-2.5 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-sm"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setContractToDelete(item);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="inline-flex items-center px-2.5 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-sm"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-12 h-12 text-gray-300 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="text-lg font-medium">No items found</p>
                        <p className="text-sm">
                          {searchTerm
                            ? "Try adjusting your search terms"
                            : "No requests or contracts available"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Contract Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[100vh] overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Create New Contract
              </h2>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Info Section - 2 columns */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Student Information Card */}
                {selectedUserInfo && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="text-sm font-semibold mb-3 text-blue-800 flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                      </svg>
                      Student Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Full Name</p>
                        <p className="text-sm font-medium">
                          {selectedUserInfo.fullName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium">
                          {selectedUserInfo.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone Number</p>
                        <p className="text-sm font-medium">
                          {selectedUserInfo.phoneNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Role</p>
                        <p className="text-sm font-medium capitalize">
                          {selectedUserInfo.roleName}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Request Information Card */}
                {selectedRequest && (
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <h3 className="text-sm font-semibold mb-3 text-amber-800 flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Request Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Request ID</p>
                        <p className="text-sm font-medium">
                          {selectedRequest.requestId}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Item Name</p>
                        <p className="text-sm font-medium">
                          {selectedRequest.itemName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Start Date</p>
                        <p className="text-sm font-medium">
                          {format(
                            new Date(selectedRequest.startDate),
                            "dd/MM/yyyy"
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">End Date</p>
                        <p className="text-sm font-medium">
                          {format(
                            new Date(selectedRequest.endDate),
                            "dd/MM/yyyy"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Contract Form */}
              <form
                onSubmit={handleCreateContract}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <h3 className="text-sm font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Contract Details
                </h3>

                <div className="space-y-3">
                  {/* Item Value */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Item Value <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        ₫
                      </span>
                      <input
                        type="text"
                        readOnly
                        value={contractForm.itemValue.toLocaleString()}
                        className="w-full pl-8 py-2 text-sm rounded border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-amber-500 focus:border-transparent cursor-not-allowed"
                        required
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Terms <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={contractForm.terms}
                      onChange={(e) =>
                        setContractForm({
                          ...contractForm,
                          terms: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Expected Return Date */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Expected Return Date{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={contractForm.expectedReturnDate.split("T")[0]}
                      min={selectedRequest?.startDate.split("T")[0]}
                      max={selectedRequest?.endDate.split("T")[0]}
                      onChange={handleExpectedReturnDateChange}
                      className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Choose a date between{" "}
                      {format(
                        new Date(selectedRequest?.startDate),
                        "dd/MM/yyyy"
                      )}{" "}
                      and{" "}
                      {format(new Date(selectedRequest?.endDate), "dd/MM/yyyy")}
                    </p>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedUserInfo(null);
                }}
                className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateContract}
                className="px-4 py-2 text-sm bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
              >
                Create Contract
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Contract Modal */}
      {isDetailModalOpen && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Contract Details
              </h2>
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedImages([]);
                  toast.info("Contract detail view closed");
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contract Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-amber-500">
                  Contract Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-gray-700">
                      Item Value:{" "}
                    </span>
                    <span className="text-gray-600">
                      {formatCurrency(selectedContract.itemValue || 0)}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Expected Return:{" "}
                    </span>
                    <span className="text-gray-600">
                      {format(
                        new Date(selectedContract.expectedReturnDate),
                        "dd/MM/yyyy"
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Condition:{" "}
                    </span>
                    <span className="text-gray-600">
                      {selectedContract.conditionBorrow}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Terms: </span>
                    <span className="text-gray-600">
                      {selectedContract.terms}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Serial Number:{" "}
                    </span>
                    <span className="text-gray-600">
                      {selectedContract.serialNumber || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Request Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-amber-500">
                  Request Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-gray-700">
                      Full Name:{" "}
                    </span>
                    <span className="text-gray-600">
                      {selectedContract.requestDetails?.fullName}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Email: </span>
                    <span className="text-gray-600">
                      {selectedContract.requestDetails?.email}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Phone Number:{" "}
                    </span>
                    <span className="text-gray-600">
                      {selectedContract.requestDetails?.phoneNumber}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Item Name:{" "}
                    </span>
                    <span className="text-gray-600">
                      {selectedContract.requestDetails?.itemName}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Start Date:{" "}
                    </span>
                    <span className="text-gray-600">
                      {selectedContract.requestDetails?.startDate
                        ? format(
                            new Date(selectedContract.requestDetails.startDate),
                            "dd/MM/yyyy"
                          )
                        : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      End Date:{" "}
                    </span>
                    <span className="text-gray-600">
                      {selectedContract.requestDetails?.endDate
                        ? format(
                            new Date(selectedContract.requestDetails.endDate),
                            "dd/MM/yyyy"
                          )
                        : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Status:{" "}
                    </span>
                    <span
                      className={`px-2 py-1 text-sm font-medium rounded-full
        ${
          selectedContract.requestDetails?.status === "Approved"
            ? "bg-green-100 text-green-800"
            : selectedContract.requestDetails?.status === "Pending"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-gray-100 text-gray-800"
        }`}
                    >
                      {selectedContract.requestDetails?.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Images */}
            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-amber-500">
                Contract Images
              </h3>

              {/* Existing Images Section */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-700 mb-4">
                  Contract Documentation
                </h4>
                {selectedContract.contractImages &&
                selectedContract.contractImages.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 transition-all duration-300">
                    {selectedContract.contractImages.map((image, index) => (
                      <div
                        key={index}
                        className="group overflow-hidden rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300"
                      >
                        <div className="relative h-52 overflow-hidden bg-gray-100">
                          <a
                            href={image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block h-full"
                          >
                            <img
                              src={image}
                              alt={`Contract ${
                                selectedContract.contractId
                              } - Page ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onLoad={() =>
                                toast.info(
                                  `Image ${index + 1} loaded successfully`
                                )
                              }
                              onError={() =>
                                toast.error(`Failed to load image ${index + 1}`)
                              }
                            />
                          </a>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <p className="text-sm font-medium">
                              Page {index + 1}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <a
                                href={image}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-amber-600 rounded-full hover:bg-amber-700 transition-colors"
                                onClick={() =>
                                  toast.info(
                                    `Opening image ${index + 1} in new tab`
                                  )
                                }
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              </a>
                              <a
                                href={image}
                                download={`contract-${
                                  selectedContract.contractId
                                }-page-${index + 1}`}
                                className="p-1.5 bg-green-600 rounded-full hover:bg-green-700 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success(
                                    `Downloading image ${index + 1}`
                                  );
                                }}
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
                                  />
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Updated UI for the empty state with image upload
                  <div className="bg-white border border-dashed border-amber-300 rounded-lg p-6">
                    <div className="max-w-lg mx-auto">
                      <div className="text-center mb-6">
                        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber-500">
                          <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          No Contract Images
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Upload clear images of the contract to keep track of
                          agreements and documentation.
                        </p>

                        <div className="flex flex-col items-center">
                          <label
                            htmlFor="contract-images"
                            className="cursor-pointer w-full max-w-xs"
                          >
                            <div className="flex items-center justify-center p-4 border-2 border-amber-300 border-dashed rounded-lg bg-amber-50 hover:bg-amber-100 transition-all duration-300">
                              <div className="space-y-2 text-center">
                                <svg
                                  className="mx-auto h-10 w-10 text-amber-500"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 48 48"
                                >
                                  <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <div className="text-sm font-medium text-amber-600">
                                  Click to browse
                                </div>
                                <p className="text-xs text-gray-500">
                                  JPG, PNG up to 5MB
                                </p>
                              </div>
                            </div>
                            <input
                              id="contract-images"
                              name="contract-images"
                              type="file"
                              className="sr-only"
                              onChange={handleImageSelect}
                              multiple
                              accept="image/jpeg,image/png,image/jpg"
                            />
                          </label>
                        </div>

                        {/* Preview Selected Images */}
                        {selectedImages.length > 0 && (
                          <div className="mt-6 w-full animate-fadeIn">
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="text-sm font-medium text-gray-700">
                                  Selected Images ({selectedImages.length})
                                </h5>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      setSelectedImages([]);
                                      toast.info("Image selection cleared");
                                    }}
                                    className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors flex items-center gap-1"
                                    disabled={isUploading}
                                  >
                                    <svg
                                      className="w-3 h-3"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                    Clear
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                                {selectedImages.map((file, index) => (
                                  <div
                                    key={index}
                                    className="group relative rounded-md overflow-hidden border border-gray-200 bg-white shadow-sm"
                                  >
                                    <div className="aspect-[3/4] relative">
                                      <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index + 1}`}
                                        className="h-full w-full object-cover"
                                      />
                                      <button
                                        type="button"
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => {
                                          const newFiles = [...selectedImages];
                                          newFiles.splice(index, 1);
                                          setSelectedImages(newFiles);
                                          toast.info(
                                            `Removed image ${index + 1}`
                                          );
                                        }}
                                      >
                                        <svg
                                          className="w-3 h-3"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                    <div className="p-2 bg-white text-xs text-center text-gray-500 truncate">
                                      {file.name.length > 20
                                        ? file.name.substring(0, 17) + "..."
                                        : file.name}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <button
                                onClick={() =>
                                  handleUploadContractImages(
                                    selectedContract.contractId
                                  )
                                }
                                className="w-full py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:bg-amber-300"
                                disabled={
                                  isUploading || selectedImages.length === 0
                                }
                              >
                                {isUploading ? (
                                  <>
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                    <span>Uploading... {uploadProgress}%</span>
                                  </>
                                ) : (
                                  <>
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
                                      />
                                    </svg>
                                    <span>Upload Now</span>
                                  </>
                                )}
                              </button>

                              {/* Upload Progress */}
                              {isUploading && (
                                <div className="mt-3">
                                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                    <div
                                      className="bg-amber-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                                      style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedImages([]);
                  toast.info("Contract detail view closed");
                }}
                className="px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this contract? This will also
              delete any associated deposits. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (contractToDelete) {
                    handleDeleteContract(contractToDelete);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Creation Modal */}
      {isDepositModalOpen && selectedContractForDeposit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[100vh] overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Create Deposit for Contract #
                {selectedContractForDeposit.contractId}
              </h2>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Contract Summary */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-sm font-semibold mb-3 text-blue-800 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Contract Information
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Item Value</p>
                    <p className="text-sm font-medium">
                      {selectedContractForDeposit.itemValue?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      Expected Return Date
                    </p>
                    <p className="text-sm font-medium">
                      {format(
                        new Date(selectedContractForDeposit.expectedReturnDate),
                        "dd/MM/yyyy"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Terms</p>
                    <p className="text-sm font-medium">
                      {selectedContractForDeposit.terms}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Student</p>
                    <p className="text-sm font-medium">
                      {userInfoMap[selectedContractForDeposit.contractId]
                        ?.fullName || "Loading..."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Deposit Form */}
              <form
                onSubmit={handleCreateDeposit}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <h3 className="text-sm font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Deposit Details
                </h3>

                <div className="space-y-3">
                  {/* Amount */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Deposit Amount <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        ₫
                      </span>
                      <input
                        type="number"
                        name="amount"
                        step="10000"
                        value={depositForm.amount}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          const contractValue =
                            selectedContractForDeposit?.itemValue || 0;
                          const minValue =
                            calculateMinimumDeposit(contractValue);
                          const maxValue = contractValue;

                          // First update with the entered value directly
                          setDepositForm((prev) => ({
                            ...prev,
                            amount: value,
                          }));

                          // Then validate for out of range values (for warnings only)
                          if (value < minValue) {
                            toast.warning(
                              `Amount should be at least ${formatCurrency(
                                minValue
                              )}`
                            );
                          } else if (value > maxValue) {
                            toast.warning(
                              `Amount should not exceed ${formatCurrency(
                                maxValue
                              )}`
                            );
                          } else if (value >= minValue && value <= maxValue) {
                            toast.success(
                              `Valid deposit amount: ${formatCurrency(value)}`
                            );
                          }
                        }}
                        min={calculateMinimumDeposit(
                          selectedContractForDeposit?.itemValue || 0
                        )}
                        max={selectedContractForDeposit?.itemValue || 0}
                        className="w-full pl-8 pr-3 py-2 text-sm rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="mt-1 text-xs space-y-1">
                      <div className="flex justify-between">
                        <p className="text-amber-600">
                          Min:{" "}
                          {formatCurrency(
                            calculateMinimumDeposit(
                              selectedContractForDeposit?.itemValue || 0
                            )
                          )}
                        </p>
                        <p className="text-amber-600">
                          Max:{" "}
                          {formatCurrency(
                            selectedContractForDeposit?.itemValue || 0
                          )}
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-amber-600 h-1.5 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                0,
                                ((depositForm.amount -
                                  calculateMinimumDeposit(
                                    selectedContractForDeposit?.itemValue || 0
                                  )) /
                                  ((selectedContractForDeposit?.itemValue ||
                                    0) -
                                    calculateMinimumDeposit(
                                      selectedContractForDeposit?.itemValue || 0
                                    ))) *
                                  100
                              )
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-gray-500">
                        Item Value:{" "}
                        {formatCurrency(
                          selectedContractForDeposit?.itemValue || 0
                        )}
                      </p>
                      <p className="text-gray-500">
                        Recommended (30%):{" "}
                        {formatCurrency(
                          calculateMaximumDeposit(
                            selectedContractForDeposit?.itemValue || 0
                          )
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={depositForm.status}
                      onChange={(e) =>
                        setDepositForm({
                          ...depositForm,
                          status: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    >
                      {depositForm.status === "Pending" && (
                        <option value="Pending" hidden>
                          Pending
                        </option>
                      )}
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  {/* Deposit Date */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Deposit Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={
                        new Date(depositForm.depositDate)
                          .toISOString()
                          .split("T")[0]
                      }
                      onChange={(e) =>
                        setDepositForm({
                          ...depositForm,
                          depositDate: new Date(e.target.value).toISOString(),
                        })
                      }
                      className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsDepositModalOpen(false);
                  setSelectedContractForDeposit(null);
                }}
                className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDeposit}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Create Deposit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractsPage;
