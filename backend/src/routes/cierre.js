const {Router} = require('express')
const router = Router()
const cierreController = require('../controllers/cierre.controller')

router.use('/:id_proyecto',
    cierreController.getCierre)

module.exports=router