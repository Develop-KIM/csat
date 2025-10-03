const createResponse = (data, message = '', success = true) => ({
  success,
  message,
  data,
});

const successResponse = (data, message = '성공') =>
  createResponse(data, message, true);

const errorResponse = (message, error = null) => {
  const response = createResponse(null, message, false);
  if (error) response.error = error;
  return response;
};

module.exports = {
  successResponse,
  errorResponse,
};
