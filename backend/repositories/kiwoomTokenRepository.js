const { KiwoomToken } = require('../models');
const { Op } = require('sequelize');
const { parseExpires } = require('../utils/kiwoomDateParser');

class KiwoomTokenRepository {
  async findValidToken(bufferMinutes) {
    return KiwoomToken.findOne({
      where: {
        is_active: true,
        expires_dt: {
          [Op.gt]: new Date(Date.now() + bufferMinutes * 60 * 1000),
        },
      },
      order: [['expires_dt', 'ASC']],
    });
  }

  async deactivateToken(tokenId) {
    await KiwoomToken.update(
      {
        is_active: false,
        revoked_at: new Date(),
      },
      {
        where: { id: tokenId, is_active: true },
      },
    );
  }

  async create(tokenData) {
    return await KiwoomToken.create({
      access_token: tokenData.token,
      token_type: tokenData.token_type,
      expires_dt: parseExpires(tokenData.expires_dt),
      return_code: tokenData.return_code,
      return_msg: tokenData.return_msg,
      is_active: true,
    });
  }

  async findByAccessToken(accessToken) {
    return KiwoomToken.findOne({
      where: { access_token: accessToken },
    });
  }

  async deleteExpiredTokens(daysAfterExpiry) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    now.setDate(now.getDate() - daysAfterExpiry);
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const cutoffDateStr = `${yyyy}-${mm}-${dd} 00:00:00`;

    return await KiwoomToken.destroy({
      where: {
        expires_dt: {
          [Op.lt]: cutoffDateStr,
        },
      },
    });
  }
}

module.exports = new KiwoomTokenRepository();
