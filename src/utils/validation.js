export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'Email is required';
  }
  if (!regex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  return null;
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

export const validateForm = (values, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = values[field];
    let error = null;

    if (rule.required) {
      error = validateRequired(value, rule.label || field);
    }
    if (!error && value && rule.email) {
      error = validateEmail(value);
    }
    if (!error && value && rule.password) {
      error = validatePassword(value);
    }
    if (!error && value && rule.confirm && field === 'confirmPassword') {
      error = validateConfirmPassword(values.password, value);
    }

    if (error) {
      errors[field] = error;
      isValid = false;
    }
  });

  return { isValid, errors };
};
