const { sequelize } = require("../config/sequelize");
const { handleError } = require("./error.controller");
const jwt = require("jsonwebtoken");
const JWTACCESSSECRET = "12345";

function getAccessToken(user) {
  return jwt.sign(user, JWTACCESSSECRET, { expiresIn: 60 * 60 * 24 });
}

async function findUser(email) {
  return await sequelize.models.Usuario.findOne({
    attributes: [
      "id_usuario",
      "email",
      "contrasena",
      "rol",
      [sequelize.col("Persona.id_persona"), "id_persona"],
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
    where: { email },
  });
}

async function authenticateUser(req, res) {
  try {
    let usuario = await findUser(req.body.email);

    if (!usuario) return res.sendStatus(401);

    let matricula = await getMatricula(usuario.id_persona, usuario.rol);

    const authenticated =
      await sequelize.models.Usuario.prototype.comparePassword(
        req.body.contrasena,
        usuario.contrasena
      );

    if (!authenticated) return res.sendStatus(401);

    usuario = {
      id_usuario: usuario.id_usuario,
      nombre: `${usuario.get("nombre")} ${usuario.get("paterno")} ${usuario.get(
        "materno"
      )}`,
      rol: usuario.rol,
      ...(matricula && { matricula }),
    };

    res.json({ token: getAccessToken(usuario) });
  } catch (err) {
    handleError(req, res, err);
  }
}

async function getMatricula(id_persona, tipoUsuario) {
  let model;

  switch (tipoUsuario) {
    case "ALUMNO":
      model = sequelize.models.Alumno;
      break;
    case "PROFESOR":
      model = sequelize.models.Profesor;
      break;
    default:
      return null;
  }

  try {
    const { matricula } = await model.findOne({
      include: [
        {
          model: sequelize.models.Persona,
          where: { id_persona },
        },
      ],
    });

    return matricula;
  } catch (err) {
    throw err;
  }
}

async function authorizeUser(req, res) {
  const header = req.headers["authorization"];
  const accessToken = header && header.split(" ")[1];

  if (!accessToken) return res.sendStatus(401);

  jwt.verify(accessToken, JWTACCESSSECRET, (err, user) => {
    if (err) return res.status(403).json(err.message);

    res.json(user);
  });
}

module.exports = {
  authenticateUser,
  authorizeUser,
  getMatricula,
};
