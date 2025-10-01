const toTokenResponse = (tokenRecord) => ({
  expiresAt: tokenRecord.expires_dt,
  tokenType: tokenRecord.token_type,
  token: tokenRecord.access_token,
  returnCode: tokenRecord.return_code,
  returnMsg: tokenRecord.return_msg,
});

module.exports = { toTokenResponse };