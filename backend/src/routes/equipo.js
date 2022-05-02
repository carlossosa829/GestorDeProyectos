const { Router } = require("express");
const router = Router({ mergeParams: true });
const equipoController = require("../controllers/equipo.controller");

router
  .route("/")
  .get(equipoController.getIntegrantes)
  .post(equipoController.validateIntegrante, equipoController.agregarIntegrante)
  .put(
    equipoController.validateIntegrante,
    equipoController.modificarIntegrante
  )
  .delete(
    equipoController.validateIntegrante,
    equipoController.eliminarIntegrante
  );
module.exports = router;
