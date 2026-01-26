/**
 * Email validation
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Password validation (min 6 characters)
 */
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Phone number validation (10 digits)
 */
export const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone.replace(/\D/g, ''));
};

/**
 * URL validation
 */
export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Required field validation
 */
export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Min length validation
 */
export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

/**
 * Max length validation
 */
export const validateMaxLength = (value, maxLength) => {
  return !value || value.length <= maxLength;
};

/**
 * Number range validation
 */
export const validateRange = (value, min, max) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Date validation (must be in the future)
 */
export const validateFutureDate = (date) => {
  return new Date(date) > new Date();
};

/**
 * Date validation (must be in the past)
 */
export const validatePastDate = (date) => {
  return new Date(date) < new Date();
};

/**
 * File size validation
 */
export const validateFileSize = (file, maxSize) => {
  return file && file.size <= maxSize;
};

/**
 * File type validation
 */
export const validateFileType = (file, allowedTypes) => {
  if (!file) return false;
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  return allowedTypes.includes(fileExtension);
};

/**
 * Form validation helper
 */
export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = values[field];

    // Required validation
    if (fieldRules.required && !validateRequired(value)) {
      errors[field] = fieldRules.required;
      return;
    }

    // Skip other validations if field is empty and not required
    if (!value && !fieldRules.required) {
      return;
    }

    // Email validation
    if (fieldRules.email && !validateEmail(value)) {
      errors[field] = fieldRules.email;
      return;
    }

    // Password validation
    if (fieldRules.password && !validatePassword(value)) {
      errors[field] = fieldRules.password;
      return;
    }

    // Phone validation
    if (fieldRules.phone && !validatePhone(value)) {
      errors[field] = fieldRules.phone;
      return;
    }

    // URL validation
    if (fieldRules.url && !validateURL(value)) {
      errors[field] = fieldRules.url;
      return;
    }

    // Min length validation
    if (fieldRules.minLength && !validateMinLength(value, fieldRules.minLength.value)) {
      errors[field] = fieldRules.minLength.message;
      return;
    }

    // Max length validation
    if (fieldRules.maxLength && !validateMaxLength(value, fieldRules.maxLength.value)) {
      errors[field] = fieldRules.maxLength.message;
      return;
    }

    // Range validation
    if (fieldRules.range && !validateRange(value, fieldRules.range.min, fieldRules.range.max)) {
      errors[field] = fieldRules.range.message;
      return;
    }

    // Custom validation
    if (fieldRules.custom && !fieldRules.custom.validate(value, values)) {
      errors[field] = fieldRules.custom.message;
      return;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Common validation rules
 */
export const VALIDATION_RULES = {
  email: {
    required: 'Email is required',
    email: 'Please enter a valid email address'
  },
  password: {
    required: 'Password is required',
    password: 'Password must be at least 6 characters'
  },
  name: {
    required: 'Name is required',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters'
    }
  },
  phone: {
    phone: 'Please enter a valid 10-digit phone number'
  },
  companyName: {
    required: 'Company name is required'
  },
  jobTitle: {
    required: 'Job title is required',
    minLength: {
      value: 3,
      message: 'Title must be at least 3 characters'
    }
  },
  description: {
    required: 'Description is required',
    minLength: {
      value: 50,
      message: 'Description must be at least 50 characters'
    }
  },
  salary: {
    required: 'Salary is required',
    range: {
      min: 0,
      max: 10000000,
      message: 'Please enter a valid salary'
    }
  }
};

export default {
  validateEmail,
  validatePassword,
  validatePhone,
  validateURL,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateRange,
  validateFutureDate,
  validatePastDate,
  validateFileSize,
  validateFileType,
  validateForm,
  VALIDATION_RULES
};