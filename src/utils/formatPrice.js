/**
 * Format a number as a Vietnamese Dong (VND) price string
 * @param {number} price - The price to format
 * @returns {string} Formatted price string
 */
function formatPrice(price) {
  if (!price && price !== 0) return "N/A";
  
  return price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

export default formatPrice; 