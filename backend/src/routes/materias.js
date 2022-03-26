const {Router} = require('express')
const router = Router()
const materiasController = require('../controllers/materias.controller')

router.get('/',
    materiasController.getMaterias)
router.get('/:nrc/lista',
    materiasController.existsMateria,
    materiasController.getAlumnosIncritos)
router.get('/:nrc/proyectos',
    materiasController.existsMateria,
    materiasController.findProyectos);
router.get('/:nrc/reporte',
    materiasController.existsMateria,
    materiasController.getInfoEquipos);
router.get('/:nrc/entregables',
    materiasController.existsMateria,
    materiasController.getEntregables)

module.exports=router;