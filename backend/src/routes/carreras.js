const {Router} = require('express')
const router = Router()
const carrerasController = require('../controllers/carreras.controller')

router.get('/',
    carrerasController.getCarreras)

module.exports = router