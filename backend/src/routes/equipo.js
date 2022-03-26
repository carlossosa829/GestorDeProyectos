const {Router} = require('express')
const router = Router({mergeParams: true})
const equipoController = require('../controllers/equipo.controller')

router.route('/')
    .get(equipoController.getIntegrantes)
    .post(equipoController.agregarIntegrante)
    .delete(equipoController.eliminarIntegrante)
module.exports = router