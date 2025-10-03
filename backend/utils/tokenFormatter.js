const toTokenStatusResponse = (token) => ({
  id: token.id,
  isActive: token.is_active,
  expiresDt: token.expires_dt,
  createdDt: token.created_dt,
  revokedDt: token.revoked_dt,
});

module.exports = { toTokenStatusResponse };
