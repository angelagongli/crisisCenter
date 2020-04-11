module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define("Comment", {
    message: {
      type: DataTypes.STRING
    }
  });

  Comment.associate = function(models) {
    models.Comment.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Comment;
};
