'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('kiwoom_tokens', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      access_token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      token_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'Bearer',
      },
      expires_dt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      return_code: {
        type: Sequelize.STRING(20),
      },
      return_msg: {
        type: Sequelize.TEXT,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      revoked_at: {
        type: Sequelize.DATE,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('kiwoom_tokens');
  }
};