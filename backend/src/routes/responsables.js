const { Router } = require("express");
const router = Router({ mergeParams: true });
const responsablesController = require("../controllers/responsable.controller");
const tareasController = require("../controllers/tareas.controller");

router
  .route("/:id_tarea")
  .all(tareasController.existsTarea)
  .get(responsablesController.getResponsables)
  .post(
    responsablesController.validateResponsable,
    responsablesController.createResponsable
  )
  .delete(responsablesController.deleteResponsable);

module.exports = router;
