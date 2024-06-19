'use strict';

import { Model, DataTypes } from 'sequelize';

class Credential extends Model {
  // Define associations for Credential.
  static associate(models) {
      this.belongsTo(models.user, { foreignKey: 'userId' });
  }

  isAccepted() {
      return this.credentialStatus === 'Uploaded';
  }

  isVerified() {
      return this.credentialStatus === 'Verified';
  }

  isProcessing() {
      return this.credentialStatus === 'Rejected';
  }
}

const initializeCredentialModel = (sequelize, DataTypes) => {
    Credential.init({
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
        credentialName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        credentialDetails: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        credentialFiles: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        credentialStatus: {
          type: DataTypes.ENUM('Uploaded', 'Verified', 'Rejected'),
          defaultValue: 'Uploaded'
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
        modelName: 'credential',
    });
    
    return Credential;
};

export default initializeCredentialModel;