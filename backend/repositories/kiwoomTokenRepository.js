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
      order: [['created_at', 'DESC']],
    });
  }

  async deactivateAll() {
    const [affectedCount] = await KiwoomToken.update(
      {
        is_active: false,
        revoked_at: new Date(),
      },
      {
        where: { is_active: true },
      },
    );

    return affectedCount;
  }

  async create(tokenData) {
    console.log('Creating KiwoomToken with data:', tokenData);
    return await KiwoomToken.create({
      access_token: tokenData.token,
      token_type: tokenData.token_type,
      expires_dt: parseExpires(tokenData.expires_dt),
      return_code: tokenData.return_code,
      return_msg: tokenData.return_msg,
      created_at: new Date(),
      is_active: true,
    });
  }

  async findByAccessToken(accessToken) {
    return KiwoomToken.findOne({
      where: { access_token: accessToken },
    });
  }

  async findAll(options = {}) {
    return await KiwoomToken.findAll({
      order: [['created_at', 'DESC']],
      ...options,
    });
  }

  async countActive() {
    return await KiwoomToken.count({
      where: { is_active: true },
    });
  }

  async deleteExpired(daysAgo = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

    return await KiwoomToken.destroy({
      where: {
        expires_dt: {
          [Op.lt]: cutoffDate,
        },
      },
    });
  }
}

module.exports = new KiwoomTokenRepository();
