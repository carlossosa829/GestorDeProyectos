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
          if (value === null) return;

          let alumno = await sequelize.models.Alumno.findOne({
            where: { matricula: value },
          });
          if (!alumno)
            throw new Error(
              "No se encuentra un alumno con la matricula proporcionada."
            );
        },
      },
    },
    id_tarea: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "El id de la tarea debe ser proporcionado.",
        },
        async isValid(value) {
          if (value === null) return;

          let tarea = await sequelize.models.Tarea.findOne({
            where: { id_tarea: value },
          });
          if (!tarea)
            throw new Error(
              "No se encuentra una tarea con el id proporcionado."
            );
        },
      },
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

  models.Responsable.hasMany(models.Tarea, {
    foreignKey: {
      name: "id_tarea",
      allowNull: false,
    },
  });
};

module.exports = Responsable;
