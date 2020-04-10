module.exports = function(sequelize, DataTypes) {
  let Comment = sequelize.define("Comment", {
    message: {
      type: DataTypes.string,
    },
  });
  return Comment;
};

Comment.associate = function(models) {
  models.Comment.belongsTo(models.User, {
    foreignKey: {
      allowNull: false,
    },
  });
};
