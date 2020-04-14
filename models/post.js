module.exports = function(sequelize, DataTypes) {
  let Post = sequelize.define("Post", {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Post.associate = function(models) {
    models.Post.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  Post.associate = function(models) {
    models.Post.hasMany(models.Comment, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Post;
};
