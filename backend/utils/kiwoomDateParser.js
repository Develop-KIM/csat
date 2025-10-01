const parseExpiresDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string' || dateStr.length !== 14) {
    throw new Error(`키움 API 날짜 형식 오류: ${dateStr}`);
  }

  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  const hour = dateStr.substring(8, 10);
  const minute = dateStr.substring(10, 12);
  const second = dateStr.substring(12, 14);

  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
};

module.exports = { parseExpiresDate };
