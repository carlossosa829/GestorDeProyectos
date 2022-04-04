const {Router} = require('express')
const router = Router({mergeParams: true})
const etapasController = require('../controllers/etapas.controller')

router.route('/')
    .get(etapasController.getEtapas)
    .post(
        etapasController.validateEtapa('post'),
        etapasController.createEtapa)
router.route('/:id_etapa')
    .all(etapasController.existsEtapa)
    .get(etapasController.getEtapa)
    .put(
        etapasController.validateEtapa('put'),
        etapasController.updateEtapa)
    .delete(etapasController.deleteEtapa)

module.exports = router