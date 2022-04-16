const { sequelize } = require("../config/sequelize");
const { handleError } = require("./error.controller");
const ModelValidator = require("../validator/ModelValidator");

async function existsTarea(req, res, next) {
  const { id_tarea } = req.params;

  try {
    const tarea = await sequelize.models.Tarea.findOne({ where: { id_tarea } });
    tarea ? next() : res.sendStatus(404);
  } catch (err) {
    handleError(req, res, err);
  }
}

function buildTarea(body) {
  return sequelize.models.Tarea.build({
    estado: body.estado,
    titulo: body.titulo,
    descripcion: body.descripcion,
    fecha_asignacion: body.fecha_asignacion,
    fecha_termino: body.fecha_termino || null,
    id_etapa: body.id_etapa,
  });
}

async function createTarea(req, res) {
  let tarea = buildTarea(req.body);

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

function getTareas(req, res) {
  const { id_proyecto } = req.params;

  sequelize.models.Tarea.findAll({
    attributes: [
      "id_tarea",
      "estado",
      "titulo",
      "descripcion",
      "fecha_asignacion",
      "fecha_termino",
      "id_etapa",
    ],
    include: [
      {
        model: sequelize.models.Etapa,
        attributes: ["id_etapa", "nombre", "estado"],
        where: { id_proyecto },
      },
      {
        model: sequelize.models.Responsable,
        attributes: ["matricula"],
      },
    ],
  })
    .then(async (tareas) => {
      if (!tareas) return [];
      return await res.json(tareas);
    })
    .catch((err) => handleError(req, res, err));
}

function findDetalles(req, res) {
  const { id_tarea } = req.params;

  sequelize.models.Tarea.findOne({
    attributes: [
      "id_tarea",
      "estado",
      "titulo",
      "descripcion",
      "fecha_asignacion",
      "fecha_termino",
      "id_etapa",
    ],
    include: [
      {
        model: sequelize.models.Etapa,
        attributes: ["id_etapa", "nombre", "estado"],
      },
      {
        model: sequelize.models.Responsable,
        attributes: ["matricula"],
      },
    ],
    where: { id_tarea },
  })
    .then(async (tareas) => {
      if (!tareas) return [];
      return await res.json(tareas);
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
          estado: req.body.estado,
          titulo: req.body.titulo,
          descripcion: req.body.descripcion,
          fecha_asignacion: req.body.fecha_asignacion,
          fecha_termino: req.body.fecha_termino || null,
          id_etapa: req.body.id_etapa,
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
  getTareas,
  findDetalles,
  updateTarea,
  existsTarea,
  deleteTarea,
};
