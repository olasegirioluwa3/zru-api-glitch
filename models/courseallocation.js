'use strict';

import { Model, DataTypes } from 'sequelize';

class CourseAllocation extends Model {
  // Define associations for CourseAllocation.
  static associate(models) {
    this.belongsTo(models.course, { foreignKey: 'courseId' });
  }
}

const initializeCourseAllocationModel = (sequelize, DataTypes) => {
  CourseAllocation.init({
    caId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'courseId',
      },
    },
    programId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'facultyprograms',
        key: 'programId',
      },
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '100'
    },  
    semester: {
      type: DataTypes.STRING,
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
  },{
    sequelize,
    modelName: 'courseallocation',
  });

  return CourseAllocation;
};

export default initializeCourseAllocationModel;