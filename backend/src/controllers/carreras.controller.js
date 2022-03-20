const {sequelize} = require('../config/sequelize')
const errorController = require('./error.controller')

function getCarreras(req,res) {
    sequelize.models.Carrera.findAll()
    .then(carreras => res.json(carreras))
    .catch(err => errorController.handleError(req,res,err))
}

module.exports = {
    getCarreras
}