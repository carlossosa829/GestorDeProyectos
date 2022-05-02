const { sequelize } = require("../config/sequelize.js");
const { DataTypes } = require("sequelize");

const Tarea = sequelize.define(
  "Tarea",
  {
    id_tarea: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    estado: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    titulo: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "El nombre debe ser proporcionado.",
        },
        len: {
          args: [5, 45],
          msg: "Pocos o demasiados carácteres.",
        },
      },
    },
    descripcion: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: {
          args: [0, 200],
          msg: "Pocos o demasiados caracteres.",
        },
      },
    },
    fecha_asignacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.DATE.NOW,
      validate: {
        notNull: {
          args: true,
          msg: "La fecha de asignacion debe ser proporcionada.",
        },
        isDate: {
          args: true,
          msg: "La fecha de asignacion no contiene un formato válido.",
        },
      },
    },
    fecha_termino: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: {
          args: true,
          msg: "La fecha termino no contiene un formato válido.",
        },
      },
    },
    id_etapa: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "tarea",
    timestamps: false,
    hooks: {
      beforeSave: (tarea, options) => {
        tarea.set("titulo", tarea.get("titulo").toUpperCase());
        tarea.set("descripcion", tarea.get("descripcion").toUpperCase());
      },
    },
  }
);

Tarea.associate = function (models) {
  models.Tarea.belongsToMany(models.Alumno, {
    through: models.Responsable,
    foreignKey: "id_tarea",
  });

  models.Tarea.hasMany(models.Responsable, {
    foreignKey: {
      name: "id_tarea",
      allowNull: false,
    },
  });

  models.Tarea.belongsTo(models.Etapa, {
    foreignKey: {
      name: "id_etapa",
      allowNull: false,
    },
    onDelete: "CASCADE",
  });
};

module.exports = Tarea;
