const {Router} = require('express')
const router = Router()
const archivosController = require('../controllers/archivos.controller')

router.post('/:id_proyecto',
    archivosController.subirArchivo)

module.exports=router;
