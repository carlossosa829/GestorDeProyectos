const {Router} = require('express')
const router = Router()
const asignacionController = require('../controllers/asignacion.controller')

router.get('/:id_proyecto',
    asignacionController.getAsignacines)
router.get('/:id_proyecto/resumen',
    asignacionController.getAsignacinesCompletas)

module.exports = router