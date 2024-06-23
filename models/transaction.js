'use strict';

import { Model, DataTypes } from 'sequelize';

class Transaction extends Model {
  static associate(models) {
    // Associate Transaction with RegCenter
    // Transaction.belongsTo(models.RegCenter, { foreignKey: 'regCenterId' });
  }
}

const initializeTransactionModel = (sequelize) => {
  Transaction.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0.0
    },
    transactionType: {
      type: DataTypes.ENUM('undetermined', 'credit', 'debit'),
      allowNull: false,
      defaultValue: "undetermined",
    },
    regCenterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    applicationId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Nullable for non-application-related transactions
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'declined'),
      allowNull: true,
      defaultValue: 'pending',
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'transaction',
    tableName: 'transactions',
    timestamps: true,
  });

  return Transaction;
};

export default initializeTransactionModel;
