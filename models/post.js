module.exports = function(sequelize, DataTypes) {
  let Post = sequelize.define("Post", {
    title: {
      type: DataTypes.string,
    },
    body: {
      type: DataTypes.string,
    },
  });
  return Post;
};

Post.associate = function(models) {
  models.Post.belongsTo(models.User, {
    foreignKey: {
      allowNull: false,
    },
  });
};
Post.associate = function(models) {
  models.Post.hasMany(models.Comment, {
    onDelete: "CASCADE",
    foreignKey: {
      allowNull: false,
    },
  });
};
