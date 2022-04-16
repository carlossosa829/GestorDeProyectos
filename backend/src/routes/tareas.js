const { Router } = require("express");
const router = Router({ mergeParams: true });
const tareasController = require("../controllers/tareas.controller");

router
  .route("/")
  .get(tareasController.getTareas)
  .post(tareasController.validateTarea("post"), tareasController.createTarea);
router
  .route("/:id_tarea")
  .all(tareasController.existsTarea)
  .get(tareasController.findDetalles)
  .put(tareasController.validateTarea("put"), tareasController.updateTarea)
  .delete(tareasController.deleteTarea);

module.exports = router;
