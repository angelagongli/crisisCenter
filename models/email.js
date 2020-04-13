module.exports = function(sequelize, DataTypes) {
    var Email = sequelize.define("Email", {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        },
        recipientID: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    Email.associate = function(models) {
        models.Email.belongsTo(models.User, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });  
      }

    return Email;
}  