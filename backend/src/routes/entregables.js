const {Router} = require('express')
const router = Router()
const entregablesController = require('../controllers/entregables.controller')
const proyectosController = require('../controllers/proyectos.controller')
const etapasController = require('../controllers/etapas.controller')

router.route('/calificar/:id_entregable')
    .all(entregablesController.existsEntregable)
    .post(entregablesController.calificar)
router.route('/:id_entregable')
    .get(entregablesController.existsEntregable,
        entregablesController.getEntregable)
router.route('/:id_entregable/rubrica')
    .all(entregablesController.existsEntregable)
    .get(entregablesController.descargarRubrica)
router.route('/:id_entregable/entregable')
    .all(entregablesController.existsEntregable)
    .get(entregablesController.descargarEntregable)
    .post(entregablesController.subirEntregable)
router.route('/:id_entregable/verEntregable')
    .all(entregablesController.existsEntregable)
    .get(entregablesController.verEntregable)
router.route('/:id_proyecto/:id_etapa')
    .all(proyectosController.existsProyecto,
        etapasController.existsEtapa)
    .get(entregablesController.getEntregablesProyecto)

module.exports = router