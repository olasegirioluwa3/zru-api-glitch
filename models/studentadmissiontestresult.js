'use strict';

import { Model, DataTypes } from 'sequelize';

class StudentAdmissionTestResult extends Model {
  // Define associations for StudentAdmissionTestResult.
  static associate(models) {
      this.belongsTo(models.user, { foreignKey: 'userId' });
  }
}

const initializeStudentAdmissionTestResultModel = (sequelize, DataTypes) => {
    StudentAdmissionTestResult.init({
      // StudentAdmissionTestResult fields go here
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
      examName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      examYear: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      examNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      examTotalScore: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      resultDetails: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      verificationStatus: {
        type: DataTypes.ENUM('Pending', 'Verified', 'Rejected', 'Processing'),
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
        modelName: 'studentadmissiontestresult',
    });
    
    return StudentAdmissionTestResult;
};

export default initializeStudentAdmissionTestResultModel;