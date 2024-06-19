'use strict';

import { Model, DataTypes } from 'sequelize';

// ... rest of your code
class AdmissionTestSubject extends Model {
  // ...
  static associate(models) {
    // define association here
  }
}

const initializeAdmissionTestSubjectModel = (sequelize, DataTypes) => {
  AdmissionTestSubject.init({
    // ...
    ats_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ats_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    ats_value: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    ats_desc: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    at_id: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'admissiontestsubject',
  });
  return AdmissionTestSubject;
};

export default initializeAdmissionTestSubjectModel;