const toTokenResponse = (tokenRecord) => ({
  expiresDt: tokenRecord.expires_dt,
  tokenType: tokenRecord.token_type,
  token: tokenRecord.access_token,
  returnCode: tokenRecord.return_code,
  returnMsg: tokenRecord.return_msg,
});

const toTokenStatusResponse = (token) => ({
  id: token.id,
  isActive: token.is_active,
  expiresDt: token.expires_dt,
  createdDt: token.created_dt,
  revokedDt: token.revoked_dt,
});

module.exports = { toTokenResponse, toTokenStatusResponse };
