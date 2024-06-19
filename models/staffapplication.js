'use strict';

import { Model, DataTypes } from 'sequelize';

class StaffApplication extends Model {
  // Define associations for Application.
  static associate(models) {
      this.belongsTo(models.user, { foreignKey: 'userId' });
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

const initializeStaffApplicationModel = (sequelize, DataTypes) => {
    StaffApplication.init({
        id: {
          allowNull: false,
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {  // Foreign key to User model
          type: DataTypes.INTEGER,
          references: {
            model: 'users',  // table name 
            key: 'id'
          },
          allowNull: false
        },
        jobTitle: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true
          }
        },
        jobPosition: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        CV: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        coverLetter: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        applicationDetails: {
          type: DataTypes.TEXT,
          allowNull: true,
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
        modelName: 'staffapplication',
    });
    
    return StaffApplication;
};

export default initializeStaffApplicationModel;