'use strict';

import { Model, DataTypes } from 'sequelize';

// ... rest of your code
class SchoolLeavingExam extends Model {
  // ...
  static associate(models) {
    // define association here
  }
}

const initializeSchoolLeavingExamModel = (sequelize, DataTypes) => {
  SchoolLeavingExam.init({
    // ...
    sle_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    sle_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    sle_value: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    sle_desc: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    sle_region: {
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
    modelName: 'schoolleavingexam',
  });
  return SchoolLeavingExam;
};

export default initializeSchoolLeavingExamModel;