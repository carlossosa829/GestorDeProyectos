const { sequelize } = require("../config/sequelize");
const { handleError } = require("./error.controller");
const ModelValidator = require("../validator/ModelValidator");

function existsResponsable(req, res, next) {
  sequelize.models.Responsable.findOne({
    where: {
      id_tarea: req.body.id_tarea,
      matricula: req.body.matricula,
    },
  })
    .then((responsable) => {
      if (responsable) next();
      else res.sendStatus(404);
    })
    .catch((err) => handleError(req, res, err));
}

function buildResponsable(body) {
  return sequelize.models.Responsable.build({
    matricula: body.matricula,
    id_tarea: body.id_tarea,
  });
}

async function createResponsable(req, res) {
  let responsable = buildResponsable(req.body);

  try {
    await sequelize.transaction(async (t) => {
      responsable = await responsable.save({ transaction: t, validate: false });
    });

    return res.sendStatus(201);
  } catch (err) {
    handleError(req, res, err);
  }
}

async function validateResponsable(req, res, next) {
  let responsable = buildResponsable(req.body);
  let validator = new ModelValidator();
  let skip = [];

  try {
    await validator.validate(responsable, { skip });
  } catch (err) {
    return handleError(req, res, err);
  }

  let validationErrors = validator.getErrors();

  if (validationErrors)
    return res.status(422).json({ errors: validationErrors });

  next();
}

function getResponsables(req, res) {
  const { id_tarea } = req.params;

  sequelize.models.Responsable.findAll({
    attributes: ["id_tarea", "matricula"],
    where: {
      id_tarea,
    },
  })
    .then(async (responsables) => {
      if (!responsables) return [];
      return await res.json(responsables);
    })
    .catch((err) => handleError(req, res, err));
}

async function deleteResponsable(req, res) {
  const { id_tarea } = req.params;
  const { matricula } = req.body;

  try {
    const responsable = await sequelize.models.Responsable.findOne({
      where: { id_tarea, matricula },
    });

    await sequelize.transaction(async (t) => {
      await responsable.destroy({ transaction: t });
    });

    res.sendStatus(200);
  } catch (err) {
    handleError(req, res, err);
  }
}

module.exports = {
  validateResponsable,
  createResponsable,
  existsResponsable,
  getResponsables,
  deleteResponsable,
};
