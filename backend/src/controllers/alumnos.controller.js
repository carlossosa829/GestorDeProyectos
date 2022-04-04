const { sequelize } = require("../config/sequelize");
const errorController = require("./error.controller");
const ModelValidator = require("../validator/ModelValidator");

function existsAlumno(req, res, next) {
  sequelize.models.Alumno.findOne({
    where: { matricula: req.params.matricula },
  })
    .then((alumno) => {
      if (alumno) next();
      else res.sendStatus(404);
    })
    .catch((err) => errorController.handleError(req, res, err));
}

function buildPersona(body) {
  return sequelize.models.Persona.build({
    nombre: body.nombre,
    paterno: body.paterno,
    materno: body.materno,
    sexo: body.sexo,
  });
}

function buildUsuario(body) {
  return sequelize.models.Usuario.build({
    email: body.email,
    contrasena: body.contrasena,
    rol: body.rol,
  });
}

function buildAlumno(body) {
  return sequelize.models.Alumno.build({
    matricula: body.matricula,
    id_carrera: body.id_carrera || null,
  });
}

function getAlumnos(req, res) {
  sequelize.models.Alumno.findAll({
    attributes: [
      "matricula",
      [sequelize.col("Persona.nombre"), "nombre"],
      [sequelize.col("Persona.paterno"), "paterno"],
      [sequelize.col("Persona.materno"), "materno"],
    ],
    include: [
      {
        model: sequelize.models.Persona,
        attributes: [],
      },
    ],
  })
    .then((alumnos) => {
      res.json(alumnos);
    })
    .catch((err) => {
      errorController.handleError(req, res, err);
    });
}

function getAlumno(req, res) {
  sequelize.models.Alumno.findOne({
    attributes: [
      "matricula",
      [sequelize.col("Persona.nombre"), "nombre"],
      [sequelize.col("Persona.paterno"), "paterno"],
      [sequelize.col("Persona.materno"), "materno"],
      [sequelize.col("Persona.sexo"), "sexo"],
      [sequelize.col("Carrera.nombre"), "carrera"],
    ],
    include: [
      {
        model: sequelize.models.Persona,
        attributes: [],
      },
      {
        model: sequelize.models.Carrera,
        attributes: [],
      },
    ],
    where: { matricula: req.params.matricula },
  })
    .then((alumno) => {
      if (!alumno) return res.sendStatus(404);
      res.json(alumno);
    })
    .catch((err) => {
      errorController.handleError(req, res, err);
    });
}

function getProyectosAlumno(req, res) {
  sequelize.models.Alumno.findOne({
    attributes: [],
    include: { all: true, nested: true },
    where: { matricula: req.params.matricula },
  })
    .then(async (proyectos) => {
      if (!proyectos) return [];
      return await res.json(proyectos.Proyectos);
    })
    .catch((err) => errorController.handleError(req, res, err));
}

function validateAlumno(requestType) {
  return async (req, res, next) => {
    let persona = buildPersona(req.body);
    let alumno = buildAlumno(req.body);
    let usuario = buildUsuario(req.body);

    let validator = new ModelValidator();

    try {
      await validator.validate(persona, { skip: ["id_persona"] });
      await validator.validate(alumno, { skip: ["id_persona"] });
      await validator.validate(usuario, { skip: ["id_persona"] });

      if (requestType === "post") {
        const matriculaOccupied = await sequelize.models.Alumno.findOne({
          where: { matricula: alumno.matricula },
        });

        if (matriculaOccupied) {
          validator.addError(
            "matricula",
            "La matrícula ingresada ya se encuentra registrada."
          );
        }
      }
    } catch (err) {
      return errorController.handleError(req, res, err);
    }

    let validationErrors = validator.getErrors();

    if (validationErrors)
      return res.status(422).json({ errors: validationErrors });

    next();
  };
}

async function createAlumno(req, res) {
  let persona = buildPersona(req.body);
  let alumno = buildAlumno(req.body);
  let usuario = buildUsuario(req.body);

  try {
    await sequelize.transaction(async (t) => {
      persona = await persona.save({ transaction: t, validate: false });
      alumno.set("id_persona", persona.get("id_persona"));
      await alumno.save({ transaction: t, validate: false });
      usuario.set("id_persona", persona.get("id_persona"));
      await usuario.save({ transaction: t, validate: false });
    });

    return res.sendStatus(201);
  } catch (err) {
    errorController.handleError(req, res, err);
  }
}

async function updateAlumno(req, res) {
  try {
    let alumno = await sequelize.models.Alumno.findOne({
      where: { matricula: req.params.matricula },
    });
    let persona = await sequelize.models.Persona.findOne({
      where: { id_persona: alumno.get("id_persona") },
    });

    await sequelize.transaction(async (t) => {
      //UPDATING ALUMNO
      await alumno.update(
        {
          id_carrera: req.body.id_carrera || null,
        },
        {
          transaction: t,
          validate: false,
        }
      );

      //UPDATING PERSON INFO
      await persona.update(
        {
          nombre: req.body.nombre,
          paterno: req.body.paterno,
          materno: req.body.materno,
          sexo: req.body.sexo,
        },
        {
          transaction: t,
          validate: false,
        }
      );
    });

    res.sendStatus(200);
  } catch (err) {
    errorController.handleError(req, res, err);
  }
}

async function deleteAlumno(req, res) {
  try {
    const alumno = await sequelize.models.Alumno.findOne({
      where: { matricula: req.params.matricula },
    });
    const id_persona = alumno.get("id_persona");

    await sequelize.transaction(async (t) => {
      await alumno.destroy({ transaction: t });
      await (
        await sequelize.models.Persona.findOne({ where: { id_persona } })
      ).destroy({ transaction: t });
    });

    res.sendStatus(200);
  } catch (err) {
    errorController.handleError(req, res, err);
  }
}

async function getMateriasAlumno(req, res) {
  const { matricula } = req.params;

  sequelize.models.Alumno.findOne({
    include: {
      model: sequelize.models.Materia,
      through: {
        attributes: [],
      },
    },
    where: { matricula },
  })
    .then((materias) => {
      res.json(materias);
    })
    .catch((err) => handleError(req, res, err));
}

async function getTareasAlumno(req, res) {
  try {
    const { matricula } = req.params;
    const tareas = await sequelize.models.Tarea.findAll({
      where: { id_tarea },
    });
    res.json(tareas);
  } catch (err) {
    handleError(req, res, err);
  }
}

module.exports = {
  getAlumnos,
  getAlumno,
  createAlumno,
  updateAlumno,
  deleteAlumno,
  validateAlumno,
  existsAlumno,
  getProyectosAlumno,
  getMateriasAlumno,
};
