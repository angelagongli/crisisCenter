module.exports = function(sequelize, DataTypes) {
    var Tweet = sequelize.define("Tweet", {
        text: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        timeStamp: {
            type: DataTypes.DATE,
            allowNull: false
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        bookmark: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        share: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        recipientID: {
            type: DataTypes.INTEGER,
        }
    });
    return Tweet;
}  