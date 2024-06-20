'use strict';

import { Model, DataTypes } from 'sequelize';

class Admin extends Model {
  static associate(models) {
    // define association here
  }
  static async emailExist(email) {
    const admin = await Admin.findOne({
      where: {
        email: email
      }
    });
    return !!admin;
    // return this.status === 'Blocked';
  }
}

const initializeAdminModel = (sequelize) => {
  Admin.init({
    // ...
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      defaultValue: '',
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    emailVerificationStatus: {
      type: DataTypes.ENUM,
      values: ['Pending', 'Activated', 'Blocked'],
      allowNull: true,
      defaultValue: 'Pending',
    },
    emailVerificationExpires: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    resetPasswordExpires: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    coverPicture: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: true
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    localGovernment: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    role: {
      type: DataTypes.ENUM('admin', 'server', 'rumble'),
      defaultValue: 'admin'
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
    modelName: 'admin',
  });
  return Admin;
};

export default initializeAdminModel;
