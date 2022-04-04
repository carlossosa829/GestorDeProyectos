const { sequelize } = require("../config/sequelize");
const { handleError } = require("./error.controller");
const ModelValidator = require("../validator/ModelValidator");

function existsTarea(req, res, next) {
  sequelize.models.Tarea.findOne({ where: { id_tarea: req.params.id_tarea } })
    .then((tarea) => {
      if (tarea) next();
      else res.sendStatus(404);
    })
    .catch((err) => handleError(req, res, err));
}

function buildTarea(body) {
  return sequelize.models.Tarea.build({
    nombre_tarea: body.nombre_tarea,
    fecha_inicio: body.fecha_inicio,
    fecha_limite: body.fecha_limite || null,
    fecha_fin: body.fecha_fin || null,
    descripcion: body.descripcion,
  });
}

async function createTarea(req, res) {
  let tarea = buildTarea(req.body);
  console.log("****TAREA***");
  console.log(req.body);

  try {
    await sequelize.transaction(async (t) => {
      tarea = await tarea.save({ transaction: t, validate: false });
    });

    return res.sendStatus(201);
  } catch (err) {
    handleError(req, res, err);
  }
}

function validateTarea(requestType) {
  return async (req, res, next) => {
    let tarea = buildTarea(req.body);

    let validator = new ModelValidator();

    try {
      let skip = ["id_tarea"];

      if (requestType === "put") skip = ["id_tarea"];

      await validator.validate(tarea, { skip });
    } catch (err) {
      return handleError(req, res, err);
    }

    let validationErrors = validator.getErrors();

    if (validationErrors)
      return res.status(422).json({ errors: validationErrors });

    next();
  };
}

function findDetalles(req, res) {
  const { id_tarea } = req.params;

  sequelize.models.Tarea.findOne({
    include: {
      attributes: [],
      include: {
        model: sequelize.models.Tarea,
      },
    },
    attributes: [
      "id_tarea",
      "nombre_tarea",
      "fecha_inicio",
      "fecha_limite",
      "fecha_fin",
      "descripcion",
    ],
    where: { id_tarea },
  })
  .catch((err) => {
    handleError(req, res, err);
  });
}

async function updateTarea(req, res) {
  try {
    let tarea = await sequelize.models.Tarea.findOne({
      where: { id_tarea: req.params.id_tarea },
    });

    await sequelize.transaction(async (t) => {
      await tarea.update(
        {
          nombre_tarea: req.body.nombre_tarea,
          fecha_inicio: req.body.fecha_inicio,
          fecha_limite: req.body.fecha_limite || null,
          fecha_fin: req.body.fecha_fin || null,
          descripcion: req.body.descripcion,
        },
        {
          transaction: t,
          validate: false,
        }
      );
    });

    res.sendStatus(200);
  } catch (err) {
    handleError(req, res, err);
  }
}

async function deleteTarea(req, res) {
  try {
    const tarea = await sequelize.models.Tarea.findOne({
      where: { id_tarea: req.params.id_tarea },
    });

    await sequelize.transaction(async (t) => {
      await tarea.destroy({ transaction: t });
    });

    res.sendStatus(200);
  } catch (err) {
    handleError(req, res, err);
  }
}

module.exports = {
  validateTarea,
  createTarea,
  findDetalles,
  updateTarea,
  existsTarea,
  deleteTarea,
};
