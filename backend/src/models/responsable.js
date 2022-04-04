const { sequelize } = require("../config/sequelize.js");
const { DataTypes } = require("sequelize");

const Responsable = sequelize.define(
  "Responsable",
  {
    matricula: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "La matricula del alumno debe ser proporcionada.",
        },
        async isValid(value) {
          let alumno = await sequelize.models.Alumno.findOne({
            where: { matricula: value },
          });
          if (!alumno)
            throw new Error("No un alumno con la matricula proporcionada.");
        },
      },
    },
    id_tarea: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "Responsable",
  }
);

Responsable.associate = function (models) {
  models.Responsable.belongsTo(models.Alumno, {
    foreignKey: {
      name: "matricula",
      allowNull: false,
    },
    onDelete: "CASCADE",
  });

  models.Responsable.belongsTo(models.Tarea, {
    foreignKey: {
      name: "id_tarea",
      allowNull: false,
    },
    onDelete: "CASCADE",
  });
};

module.exports = Responsable;
