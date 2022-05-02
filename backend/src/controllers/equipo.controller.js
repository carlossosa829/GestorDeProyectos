const { sequelize } = require("../config/sequelize");
const { handleError } = require("./error.controller");
const ModelValidator = require("../validator/ModelValidator");

exports.getIntegrantes = (req, res) => {
  const { id_proyecto } = req.params;

  sequelize.models.Equipo.findAll({
    attributes: [
      "id_proyecto",
      "matricula",
      "estado",
      "rol",
      [sequelize.col("Alumno.Persona.nombre"), "nombre"],
      [sequelize.col("Alumno.Persona.paterno"), "paterno"],
      [sequelize.col("Alumno.Persona.materno"), "materno"],
    ],
    include: {
      model: sequelize.models.Alumno,
      attributes: [],
      include: {
        model: sequelize.models.Persona,
        attributes: [],
      },
    },
    where: { id_proyecto },
  })
    .then((equipo) => res.json(equipo))
    .catch((err) => handleError(req, res, err));
};

function buildIntegrante({ id_proyecto, matricula, estado, rol }) {
  return sequelize.models.Equipo.build({
    id_proyecto: id_proyecto,
    matricula: matricula,
    estado: estado || "PENDIENTE",
    rol: rol || "VISUALIZADOR",
  });
}

exports.validateIntegrante = async (req, res, next) => {
  let integrante = buildIntegrante({ ...req.body, ...req.params });

  let validator = new ModelValidator();

  try {
    await validator.validate(integrante, { skip: [] });
  } catch (err) {
    return handleError(req, res, err);
  }

  let validationErrors = validator.getErrors();

  if (validationErrors)
    return res.status(422).json({ errors: validationErrors });

  next();
};

exports.agregarIntegrante = async (req, res) => {
  const { id_proyecto } = req.params;
  const { matricula } = req.body;

  try {
    await sequelize.models.Equipo.create({
      id_proyecto,
      matricula,
      rol: "VISUALIZADOR",
      estado: "PENDIENTE",
    });
    res.status(201).json({
      message: `El alumno con matricula ${matricula} fue añadido al proyecto.`,
    });
  } catch (err) {
    handleError(req, res, err);
  }
};

exports.modificarIntegrante = async (req, res) => {
  const { id_proyecto } = req.params;
  const { matricula, rol } = req.body;

  try {
    const integrante = await sequelize.models.Equipo.findOne({
      where: { matricula, id_proyecto },
    });
    await integrante.update({
      rol,
    });
    res.status(200).json({
      message: `El integrante ha modificado sus permisos rol ${rol}`,
    });
  } catch (err) {
    handleError(req, res, err);
  }
};

exports.eliminarIntegrante = async (req, res) => {
  const { id_proyecto } = req.params;
  const { matricula } = req.body;

  try {
    const integrante = await sequelize.models.Equipo.findOne({
      where: {
        id_proyecto,
        matricula,
      },
    });

    if (!integrante) return res.sendStatus(404);

    await integrante.destroy();
    res.sendStatus(201);
  } catch (err) {
    handleError(req, res, err);
  }
};
