module.exports = function(sequelize, DataTypes) {
    var Idea = sequelize.define("Idea", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        body: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        }
    });
    return Idea;
}  