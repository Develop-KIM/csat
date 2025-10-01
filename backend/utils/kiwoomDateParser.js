const parseExpiresDate = (expiresAt) => {
  if (!expiresAt || typeof expiresAt !== 'string' || expiresAt.length !== 14) {
    throw new Error(`키움 API 날짜 형식 오류: ${expiresAt}`);
  }

  const year = parseInt(expiresAt.substring(0, 4), 10);
  const month = parseInt(expiresAt.substring(4, 6), 10) - 1;
  const day = parseInt(expiresAt.substring(6, 8), 10);
  const hour = parseInt(expiresAt.substring(8, 10), 10);
  const minute = parseInt(expiresAt.substring(10, 12), 10);
  const second = parseInt(expiresAt.substring(12, 14), 10);

  return new Date(year, month, day, hour, minute, second);
};

module.exports = { parseExpiresDate };
