module.exports = function(sequelize, DataTypes) {
    var Family = sequelize.define("Family", {
        name: {
            type: DataTypes.STRING
        }
    });
  
    Family.associate = function(models) {
      models.Family.hasMany(models.User);
    }
    return Family;
}
