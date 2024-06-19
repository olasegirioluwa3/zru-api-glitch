'use strict';

import { Model, DataTypes } from 'sequelize';

class Application extends Model {
  // Define associations for Application.
  static associate(models) {
    // this.belongsTo(models.user, { foreignKey: 'userId' });
  }

  isAccepted() {
    return this.applicationStatus === 'Accepted';
  }

  isRejected() {
    return this.applicationStatus === 'Rejected';
  }

  isProcessing() {
    return this.applicationStatus === 'Processing';
  }
}

const initializeApplicationModel = (sequelize, DataTypes) => {
  Application.init({
    // Application fields go here
    id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {  // Foreign key to User model
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    programId: {
      type: DataTypes.INTEGER,
      allowNull: true,  // Make programId optional
      defaultValue: 0
    },
    courseName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    entryType: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    applicationDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: ''
    },
    applicationStatus: {
      type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected', 'Processing'),
      defaultValue: 'Pending'
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
    modelName: 'application',
  });

  return Application;
};

export default initializeApplicationModel;
