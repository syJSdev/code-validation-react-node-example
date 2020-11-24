export const getErrorMessageFromJoiError = (error) => {
  if (error.isJoi) {
    if (error.details && Array.isArray(error.details) && error.details.length > 0) {
      error = { message: error.details[0].message };
    } else {
      error = { message: "Validation Error" };
    }
  } else {
    return null;
  }
};
