module.exports = function(sequelize, DataTypes) {
    var Bookmark = sequelize.define("Bookmark", {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        note: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    Bookmark.associate = function(models) {
        models.Bookmark.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });  
    }

    return Bookmark;
}  