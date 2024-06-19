'use strict';

import { Model, DataTypes } from 'sequelize';

class FacultyMember extends Model {
  static associate(models) {
    // Define associations here
    this.belongsTo(models.faculty, { foreignKey: 'facultyId' });
    this.belongsTo(models.user, { foreignKey: 'userId' });
  }
}

const initializeFacultyMemberModel = (sequelize, DataTypes) => {
  FacultyMember.init({
    memberId: {
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    memberName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING(100),
    },
    researchInterests: {
      type: DataTypes.TEXT,
    },
    membershipStatus: {
      type: DataTypes.ENUM('Pending','Current', 'Past', 'Other'), // Add other status values as needed
      defaultValue: 'Current',
    },
    startDateAt: {
      allowNull: true,
      type: DataTypes.DATE
    },
    endDateAt: {
      allowNull: true,
      type: DataTypes.DATE
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
    modelName: 'facultymember',
    timestamps: false, // Disable timestamps (createdAt and updatedAt)
  });

  return FacultyMember;
};

export default initializeFacultyMemberModel;