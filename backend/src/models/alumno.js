const { sequelize } = require("../config/sequelize.js");
const { DataTypes } = require("sequelize");
const { API_URL } = require("../config/config");

const Alumno = sequelize.define(
  "Alumno",
  {
    matricula: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          args: true,
          msg: "La matrícula debe ser proporcionada.",
        },
        is: {
          args: /20[123][\d]{6}/,
          msg: "La matrícula es inválida.",
        },
        len: {
          args: 9,
          msg: "La matrícula debe tener longitud 9.",
        },
      },
    },
    id_carrera: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: sequelize.models.Carrera,
        key: "id_carrera",
      },
      validate: {
        async isValid(value) {
          if (value === null) return;

          let carrera = await sequelize.models.Carrera.findOne({
            where: { id_carrera: value },
          });
          if (!carrera) throw new Error("No es una carrera válida.");
        },
      },
    },
  },
  {
    tableName: "alumno",
    timestamps: false,
    hooks: {},
  }
);

//RELATIONSHIPS
Alumno.associate = function (models) {
  models.Alumno.belongsTo(models.Persona, {
    foreignKey: {
      name: "id_persona",
      allowNull: false,
    },
    onDelete: "CASCADE",
  });

  models.Alumno.belongsTo(models.Carrera, {
    foreignKey: {
      name: "id_carrera",
      allowNull: true,
    },
    onDelete: "SET NULL",
  });

  models.Alumno.belongsToMany(models.Materia, {
    through: models.CargaAcademica,
    foreignKey: "alumno_matricula",
  });

  models.Alumno.belongsToMany(models.Proyecto, {
    through: models.Equipo,
    foreignKey: "matricula",
  });
};

/*
models.Alumno.belongsToMany(models.Tarea, {
  through: models.Responsable,
  foreignKey: "matricula",
});*/

sequelize.sync({ force: true }); //SINCRONIZAR BASE DE DATOS

module.exports = Alumno;
