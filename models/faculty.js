'use strict';

import { Model, DataTypes } from 'sequelize';

class Faculty extends Model {
  static associate(models) {
    // Define associations here
  }
}

const initializeFacultyModel = (sequelize, DataTypes) => {
  Faculty.init({
    facultyId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    facultyName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    facultySlug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    facultyStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    welcomeMessage: {
      type: DataTypes.TEXT,
    },
    objectives: {
      type: DataTypes.TEXT,
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
    modelName: 'faculty',
    timestamps: false, // Disable timestamps (createdAt and updatedAt)
  });

  // Define any associations or additional configurations here
  return Faculty;
};

export default initializeFacultyModel;