/**
 * Money validation utility functions
 */

/**
 * Validates and formats a monetary input value
 * @param {string|number} value - The value to validate
 * @param {number} min - Minimum allowed value (default: 0)
 * @param {number} max - Maximum allowed value (default: Number.MAX_SAFE_INTEGER)
 * @returns {object} - Object containing validation result and formatted value
 */
export const validateMoneyInput = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  // Convert to number and handle potential NaN
  const numValue = parseFloat(value);
  
  // Check if it's a valid number
  if (isNaN(numValue)) {
    return {
      isValid: false,
      value: min,
      error: "Please enter a valid amount"
    };
  }
  
  // Check minimum value constraint
  if (numValue < min) {
    return {
      isValid: false,
      value: min,
      error: `Amount cannot be less than ${formatCurrency(min)}`
    };
  }
  
  // Check maximum value constraint
  if (numValue > max) {
    return {
      isValid: false,
      value: max,
      error: `Amount cannot exceed ${formatCurrency(max)}`
    };
  }
  
  return {
    isValid: true,
    value: numValue,
    error: null
  };
};

/**
 * Formats a number as VND currency
 * @param {number} value - The value to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value) => {
  return `₫${parseFloat(value).toLocaleString()}`;
};

/**
 * Handles money input change with validation
 * @param {Event} e - The input change event
 * @param {Function} setState - State setter function
 * @param {string} fieldName - Field name in the state object
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {boolean} - Whether validation passed
 */
export const handleMoneyInputChange = (e, setState, fieldName, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const { value } = e.target;
  const validationResult = validateMoneyInput(value, min, max);
  
  if (validationResult.isValid) {
    setState(prev => ({
      ...prev,
      [fieldName]: validationResult.value
    }));
    return true;
  } else if (value === '') {
    // Allow empty input during typing
    setState(prev => ({
      ...prev,
      [fieldName]: ''
    }));
    return false;
  } else {
    setState(prev => ({
      ...prev,
      [fieldName]: validationResult.value
    }));
    return false;
  }
};

/**
 * Checks if a money value is valid before submission
 * @param {number|string} value - The value to check
 * @param {string} fieldLabel - Label for the field (for error message)
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {object} - Validation result with error message if invalid
 */
export const validateMoneyField = (value, fieldLabel, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const validationResult = validateMoneyInput(value, min, max);
  
  if (!validationResult.isValid) {
    return {
      isValid: false,
      error: validationResult.error || `Please enter a valid ${fieldLabel}`
    };
  }
  
  return {
    isValid: true,
    error: null
  };
};

/**
 * Validates multiple money fields before form submission
 * @param {Object} fieldsToValidate - Object with field names as keys and validation params as values
 * @param {Function} errorHandler - Function to handle validation errors (e.g., toast.error)
 * @returns {boolean} - Whether all validations passed
 * 
 * Example usage:
 * validateMoneyBeforeSubmit(
 *   {
 *     amount: { value: formData.amount, label: "amount" },
 *     deposit: { value: formData.deposit, label: "deposit", min: 100000 }
 *   },
 *   toast.error
 * )
 */
export const validateMoneyBeforeSubmit = (fieldsToValidate, errorHandler) => {
  for (const fieldConfig of Object.values(fieldsToValidate)) {
    const { value, label, min = 0, max = Number.MAX_SAFE_INTEGER } = fieldConfig;
    const validation = validateMoneyField(value, label, min, max);
    
    if (!validation.isValid) {
      if (typeof errorHandler === 'function') {
        errorHandler(validation.error);
      }
      return false;
    }
  }
  
  return true;
};

/**
 * Calculates the suggested minimum deposit amount based on item value
 * @param {number} itemValue - The value of the item
 * @param {number} percentage - Percentage for minimum deposit (default: 10)
 * @returns {number} - Suggested minimum deposit amount
 */
export const calculateMinimumDeposit = (itemValue, percentage = 10) => {
  const minDeposit = itemValue * (percentage / 100);
  return Math.round(minDeposit); // Round to nearest integer
};

/**
 * Calculates the suggested maximum deposit amount based on item value
 * @param {number} itemValue - The value of the item
 * @param {number} percentage - Percentage for maximum deposit (default: 30)
 * @returns {number} - Suggested maximum deposit amount
 */
export const calculateMaximumDeposit = (itemValue, percentage = 30) => {
  const maxDeposit = itemValue * (percentage / 100);
  return Math.round(maxDeposit); // Round to nearest integer
};

/**
 * Validates deposit amount based on item value
 * @param {number} depositAmount - The deposit amount to validate
 * @param {number} itemValue - The value of the item
 * @param {number} minPercentage - Minimum deposit percentage (default: 10)
 * @returns {object} - Validation result with error message if invalid
 */
export const validateDeposit = (depositAmount, itemValue, minPercentage = 10) => {
  const minDeposit = calculateMinimumDeposit(itemValue, minPercentage);
  
  if (depositAmount < minDeposit) {
    return {
      isValid: false,
      error: `Deposit must be at least ${minPercentage}% (${formatCurrency(minDeposit)}) of the item value`
    };
  }
  
  if (depositAmount > itemValue) {
    return {
      isValid: false,
      error: `Deposit cannot exceed the item value (${formatCurrency(itemValue)})`
    };
  }
  
  return {
    isValid: true,
    error: null
  };
};

/**
 * Validates damage fee based on item value
 * @param {number} damageFee - The damage fee to validate
 * @param {number} itemValue - The value of the item
 * @returns {object} - Validation result with warning message if approaching item value
 */
export const validateDamageFee = (damageFee, itemValue) => {
  if (damageFee > itemValue) {
    return {
      isValid: false,
      error: `Damage fee cannot exceed the item value (${formatCurrency(itemValue)})`
    };
  }
  
  // Warning if damage fee is over 75% of item value
  if (damageFee > (itemValue * 0.75)) {
    return {
      isValid: true,
      warning: `Warning: Damage fee is approaching item value (${formatCurrency(itemValue)})`
    };
  }
  
  return {
    isValid: true,
    error: null
  };
};

/**
 * Validates compensation amounts for damaged items
 * @param {number} compensationAmount - Total compensation amount
 * @param {number} usedDepositAmount - Amount taken from the deposit
 * @param {number} extraPaymentRequired - Additional payment required
 * @param {number} damageFee - The damage fee assessed
 * @param {number} depositAmount - Original deposit amount
 * @param {number} itemValue - The value of the item
 * @returns {object} - Validation result with field-specific errors
 */
export const validateCompensation = (compensationAmount, usedDepositAmount, extraPaymentRequired, damageFee, depositAmount, itemValue) => {
  const errors = {};
  
  // Validate compensation amount
  if (compensationAmount > damageFee) {
    errors.compensationAmount = `Compensation cannot exceed damage fee (${formatCurrency(damageFee)})`;
  }
  
  if (compensationAmount > itemValue) {
    errors.compensationAmount = `Compensation cannot exceed item value (${formatCurrency(itemValue)})`;
  }
  
  // Validate used deposit amount
  if (usedDepositAmount > depositAmount) {
    errors.usedDepositAmount = `Cannot use more than available deposit (${formatCurrency(depositAmount)})`;
  }
  
  // Check if extraPaymentRequired matches the calculation
  const calculatedExtraPayment = Math.max(0, compensationAmount - usedDepositAmount);
  if (extraPaymentRequired !== calculatedExtraPayment) {
    errors.extraPaymentRequired = `Extra payment should be ${formatCurrency(calculatedExtraPayment)} (Compensation - Used Deposit)`;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Calculates the extra payment required based on compensation and used deposit
 * @param {number} compensationAmount - Total compensation amount
 * @param {number} usedDepositAmount - Amount taken from the deposit
 * @returns {number} - Extra payment required
 */
export const calculateExtraPayment = (compensationAmount, usedDepositAmount) => {
  return Math.max(0, compensationAmount - usedDepositAmount);
}; 