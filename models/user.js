'use strict';

import { Model, DataTypes } from 'sequelize';

class User extends Model {
  static associate(models) {
    // define association here
  }
  static async emailExist(email) {
    const user = await User.findOne({
      where: {
        email: email
      }
    });
    return !!user;
    // return this.status === 'Blocked';
  }
}

const initializeUserModel = (sequelize) => {
  User.init({
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
      values: ['pending', 'activated', 'blocked'],
      allowNull: true,
      defaultValue: 'pending',
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
    accountStatus: {
      type: DataTypes.ENUM('pending', 'in-review', 'activated', 'blocked'),
      allowNull: true,
      defaultValue: 'activated',
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
    regCenterId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
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
    modelName: 'user',
  });
  return User;
};

export default initializeUserModel;
