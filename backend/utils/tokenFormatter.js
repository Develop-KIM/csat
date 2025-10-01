const toTokenResponse = (tokenRecord) => ({
  expiresAt: tokenRecord.expires_dt,
  tokenType: tokenRecord.token_type,
  token: tokenRecord.access_token,
  returnCode: tokenRecord.return_code,
  returnMsg: tokenRecord.return_msg,
});

const toTokenStatusResponse = (token) => ({
  id: token.id,
  isActive: token.is_active,
  expiresAt: token.expires_dt,
  createdAt: token.created_at,
  revokedAt: token.revoked_at,
});

module.exports = { toTokenResponse, toTokenStatusResponse };