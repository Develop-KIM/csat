const createResponse = (data, message = '', success = true) => ({
  data,
  message,
  success,
  timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
});

const successResponse = (data, message = '성공') =>
  createResponse(data, message, true);

const errorResponse = (message, error = null) => {
  const response = createResponse(null, message, false);
  if (error) response.error = error;
  return response;
};

module.exports = {
  createResponse,
  successResponse,
  errorResponse,
};
