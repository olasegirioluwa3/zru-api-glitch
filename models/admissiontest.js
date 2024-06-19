'use strict';

import { Model, DataTypes } from 'sequelize';

// ... rest of your code
class AdmissionTest extends Model {
  // ...
  static associate(models) {
    // define association here
  }
}

const initializeAdmissionTestModel = (sequelize, DataTypes) => {
  AdmissionTest.init({
    at_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    at_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    at_value: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    at_desc: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    at_entry_level: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '100',
    },
    at_region: {
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
    modelName: 'admissiontest',
  });
  return AdmissionTest;
};

export default initializeAdmissionTestModel;