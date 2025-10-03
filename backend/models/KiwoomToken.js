const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const KiwoomToken = sequelize.define(
    'KiwoomToken',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      access_token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      token_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'Bearer',
      },
      expires_dt: {
        type: 'TIMESTAMP(0)',
        allowNull: false,
      },
      return_code: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      return_msg: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      revoked_dt: {
        type: 'TIMESTAMP(0)',
        allowNull: true,
      },
      created_dt: {
        type: 'TIMESTAMP(0)',
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'kiwoom_tokens',
      timestamps: false,
      underscored: true,
    },
  );

  return KiwoomToken;
};
