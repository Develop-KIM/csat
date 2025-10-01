const parseExpiresDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string' || dateStr.length !== 14) {
    throw new Error(`키움 API 날짜 형식 오류: ${dateStr}`);
  }

  const year = parseInt(dateStr.substring(0, 4), 10);
  const month = parseInt(dateStr.substring(4, 6), 10) - 1;
  const day = parseInt(dateStr.substring(6, 8), 10);
  const hour = parseInt(dateStr.substring(8, 10), 10);
  const minute = parseInt(dateStr.substring(10, 12), 10);
  const second = parseInt(dateStr.substring(12, 14), 10);

  return new Date(year, month, day, hour, minute, second);
};

module.exports = { parseExpiresDate };
