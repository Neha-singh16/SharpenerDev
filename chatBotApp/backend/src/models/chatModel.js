const {DataTypes} = require("sequelize");
const sequelize = require("../database/db-connection");

const Chat = sequelize.define("Chat", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
   message:{
    type: DataTypes.STRING,
    allowNull: false
    }
}, {
    timestamps: true
}
)

module.exports = Chat;