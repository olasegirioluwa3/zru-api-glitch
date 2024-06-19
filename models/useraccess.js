import { Model, DataTypes } from 'sequelize';

class UserAccess extends Model {
  static associate(models) {
    // this.belongsTo(models.application, { foreignKey: 'applicationId' });
  }

  isBlocked() {
    return this.status === 'Blocked';
  }

  isAccepted() {
    return this.status === 'Accepted';
  }

  isPending() {
    return this.status === 'Pending';
  }

  isSupport() {
    return this.role === 'Support';
  }

  isSupervisor() {
    return this.role === 'Supervisor';
  }

  isAdmin() {
    return this.role === 'Admin';
  }
}

const initializeUserAccessModel = (sequelize) => {
  UserAccess.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    rcId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    userId: { // e.g whatsappId
      type: DataTypes.INTEGER,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('RegCenter'),
      defaultValue: 'RegCenter'
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Active', 'Failed'),
      defaultValue: 'Pending'
    },
    inviteBy: { // e.g userId
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    inviteDate: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    acceptDate: {
      type: DataTypes.DATE,
      defaultValue: new Date()
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
    modelName: 'useraccess',
  });

  return UserAccess;
};

export default initializeUserAccessModel;
