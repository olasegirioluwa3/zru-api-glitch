import { Model, DataTypes } from 'sequelize';

class Chat extends Model {
  static associate(models) {
    // Define associations here if needed
  }
}

const initializeChatModel = (sequelize) => {
  Chat.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    saId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    contactId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    chatStatus: {
      type: DataTypes.ENUM('Open', 'Close', 'Suspended'),
      defaultValue: 'Open'
    },
    joinDate: {
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
    modelName: 'chat',
  });

  return Chat;
};

export default initializeChatModel;
