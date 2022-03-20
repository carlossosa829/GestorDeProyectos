const {Router} = require('express')
const router = Router()
const alumnosController = require('../controllers/alumnos.controller')

router.get('/',
    alumnosController.getAlumnos)
router.get('/:matricula',
    alumnosController.getAlumno)
router.get('/:matricula/proyectos',
    alumnosController.existsAlumno,
    alumnosController.getProyectosAlumno)
router.get('/:matricula/materias',
    alumnosController.existsAlumno,
    alumnosController.getMateriasAlumno)
router.post('/',
    alumnosController.validateAlumno('post'),
    alumnosController.createAlumno)
router.put('/:matricula',
    alumnosController.existsAlumno,
    alumnosController.validateAlumno('put'),
    alumnosController.updateAlumno)
router.delete('/:matricula',
    alumnosController.existsAlumno,
    alumnosController.deleteAlumno)

module.exports = router
