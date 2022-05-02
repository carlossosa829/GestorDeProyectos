const { Router } = require("express");
const router = Router();
const proyectosController = require("../controllers/proyectos.controller");
const tareasController = require("../controllers/tareas.controller");

router
  .route("/")
  .post(
    proyectosController.validateProyecto("post"),
    proyectosController.createProyecto
  );
router
  .route("/:id_proyecto")
  .all(proyectosController.existsProyecto)
  .get(proyectosController.findDetalles)
  .put(
    proyectosController.validateProyecto("put"),
    proyectosController.updateProyecto
  )
  .delete(proyectosController.deleteProyecto);
router
  .route("/:id_proyecto/entregables")
  .all(proyectosController.existsProyecto)
  .get(proyectosController.getEntregables);
router.use(
  "/:id_proyecto/etapas",
  proyectosController.existsProyecto,
  require("./etapas")
);
router.use(
  "/:id_proyecto/equipo",
  proyectosController.existsProyecto,
  require("./equipo")
);
router.use(
  "/:id_proyecto/tareas",
  proyectosController.existsProyecto,
  require("./tareas")
);

module.exports = router;
