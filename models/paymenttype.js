'use strict';

import { Model, DataTypes } from 'sequelize';

class PaymentType extends Model {
  // Define associations for Application.
  static associate(models) {
    this.belongsTo(models.facultyprogram, { foreignKey: 'programId' });
  }

  isAccepted() {
    return this.applicationStatus === 'pending';
  }

  isRejected() {
    return this.applicationStatus === 'removed';
  }

  isProcessing() {
    return this.applicationStatus === 'active';
  }
}

const initializePaymentTypeModel = (sequelize, DataTypes) => {
  PaymentType.init({
    ptId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    programId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'facultyprograms',
        key: 'programId',
      },
      defaultValue: 0
    },
    ptPurpose: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    ptAmount: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 1000
    },
    ptDefaultCurrency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'NGN'
    },
    ptStatus: {
      type: DataTypes.ENUM('pending', 'removed', 'active'),
      defaultValue: 'pending'
    },
    courseLevel: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    ptDetails: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    }
  }, {
    sequelize,
    modelName: 'paymenttype',
  });

  return PaymentType;
};

export default initializePaymentTypeModel;