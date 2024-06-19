'use strict';

import { Model, DataTypes } from 'sequelize';

// ... rest of your code
class SchoolLeavingExamGrade extends Model {
  // ...
  static associate(models) {
    // define association here
  }
}

const initializeSchoolLeavingExamGradeModel = (sequelize, DataTypes) => {
  SchoolLeavingExamGrade.init({
    // ...
    sleg_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    sleg_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    sleg_value: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    sleg_desc: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    sle_id: {
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
    modelName: 'schoolleavingexamgrade',
  });
  return SchoolLeavingExamGrade;
};

export default initializeSchoolLeavingExamGradeModel;