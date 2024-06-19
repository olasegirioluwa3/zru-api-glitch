'use strict';

import { Model, DataTypes } from 'sequelize';

// ... rest of your code
class SchoolLeavingExamSubject extends Model {
  // ...
  static associate(models) {
    // define association here
  }
}

const initializeSchoolLeavingExamSubjectModel = (sequelize, DataTypes) => {
  SchoolLeavingExamSubject.init({
    // ...
    sles_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    sles_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    sles_value: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    sles_desc: {
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
    modelName: 'schoolleavingexamsubject',
  });
  return SchoolLeavingExamSubject;
};

export default initializeSchoolLeavingExamSubjectModel;