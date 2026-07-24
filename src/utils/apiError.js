export const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    switch (status) {
      case 400:
        return data.message || 'Invalid request data';
      case 401:
        return data.message || 'Unauthorized - please login again';
      case 403:
        return data.message || 'Access denied';
      case 404:
        return data.message || 'Resource not found';
      case 409:
        return data.message || 'Conflict - resource already exists';
      case 422:
        return data.message || 'Validation error';
      case 500:
        return 'Server error - please try again later';
      default:
        return data.message || 'An error occurred';
    }
  } else if (error.request) {
    return 'Network error - please check your connection';
  }
  return error.message || 'An unexpected error occurred';
};

export const isAuthError = (error) => {
  return error.response?.status === 401;
};

export const isValidationError = (error) => {
  return error.response?.status === 400 || error.response?.status === 422;
};
