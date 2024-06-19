'use strict';

import { Model, DataTypes } from 'sequelize';

class Course extends Model {
  // Define associations for Application.
  static associate(models) {
    this.belongsTo(models.facultyprogram, { foreignKey: 'programId' });
  }
}

const initializeCourseModel = (sequelize, DataTypes) => {
  Course.init({
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    programId: {
      type: DataTypes.INTEGER,
      allowNull: true,  // Make programId optional
      references: {
        model: 'facultyprograms',
        key: 'programId',
      },
      defaultValue: 0
    },
    courseCode: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    courseTitle: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    courseCredit:{
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    courseHour:{
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    courseDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
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
    modelName: 'course',
  });

  return Course;
};

export default initializeCourseModel;