const isValidExpires = (expiresDt) => {
  return expiresDt && typeof expiresDt === 'string' && expiresDt.length === 14;
};

const parseExpires = (expiresDt) => {
  if (!isValidExpires(expiresDt)) {
    throw new Error(`키움 API 날짜 형식 오류: ${expiresDt}`);
  }

  const year = parseInt(expiresDt.substring(0, 4), 10);
  const month = parseInt(expiresDt.substring(4, 6), 10) - 1;
  const day = parseInt(expiresDt.substring(6, 8), 10);
  const hour = parseInt(expiresDt.substring(8, 10), 10);
  const minute = parseInt(expiresDt.substring(10, 12), 10);
  const second = parseInt(expiresDt.substring(12, 14), 10);

  return new Date(year, month, day, hour, minute, second);
};

module.exports = { parseExpires };
