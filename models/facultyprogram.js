'use strict';

import { Model, DataTypes } from 'sequelize';

class FacultyProgram extends Model {
  static associate(models) {
    // Define associations here
    this.belongsTo(models.faculty, { foreignKey: 'facultyId' });
  }
}

const initializeFacultyProgramModel = (sequelize, DataTypes) => {
  FacultyProgram.init({
    programId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    facultyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'faculties', // Reference the 'faculties' table
        key: 'facultyId',
      },
    },
    programName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    programCode: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    programCourse: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    degreeType: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    programDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: ''
    },
    programStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    programDuration: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: ''
    },
    graduationRequirements: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: ''
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
    modelName: 'facultyprogram',
    timestamps: false, // Disable timestamps (createdAt and updatedAt)
  });

  return FacultyProgram;
};

export default initializeFacultyProgramModel;