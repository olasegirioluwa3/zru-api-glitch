'use strict';

import { Model, DataTypes } from 'sequelize';

class RegCenter extends Model {
  static associate(models) {
    // define association here
  }
  static async emailExist(email) {
    const regcenter = await RegCenter.findOne({
      where: {
        email: email
      }
    });
    return !!regcenter;
    // return this.status === 'Blocked';
  }
}

const initializeRegCenterModel = (sequelize) => {
  RegCenter.init({
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
    centername: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    centerslug: {
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
    modelName: 'regcenter',
  });
  return RegCenter;
};

export default initializeRegCenterModel;