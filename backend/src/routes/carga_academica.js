const {sequelize} = require('../config/sequelize.js')
const {DataTypes} =require('sequelize')

const CargaAcademica = sequelize.define('CargaAcademica',{
},{
    timestamps: false,
    tableName: 'carga_academica'
})

module.exports = CargaAcademica