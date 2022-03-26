const {Router} = require('express')
const router = Router()
const profesoresController = require('../controllers/profesores.controller')

router.get('/',
    profesoresController.getProfesores)
router.get('/:matricula',
    profesoresController.getProfesor)
router.get('/:matricula/materias',
    profesoresController.existsProfesor,
    profesoresController.getMaterias)
router.post('/',
    profesoresController.validateProfesor('post'),
    profesoresController.createProfesor)
router.put('/:matricula',
    profesoresController.existsProfesor,    
    profesoresController.validateProfesor('put'),
    profesoresController.updateProfesor)
router.delete('/:matricula',
    profesoresController.existsProfesor,
    profesoresController.deleteProfesor)

module.exports = router