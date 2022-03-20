const {sequelize} = require('../config/sequelize.js')
const {DataTypes} =require('sequelize')

const Periodo = sequelize.define('Periodo',{
    id_periodo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(45),
        allowNull: false,
        validate: {
            notNull:{
                msg: 'El nombre debe ser proporcionado.'
            },
            is: {
                args: /[a-záéíóú0-9 ]/i,
                msg: 'Caracteres inválidos.'
            }
        }
    }
},{
    tableName: 'periodo',
    timestamps: false,
    hooks: {
        beforeSave: (periodo,options) => {
            periodo.set('nombre',periodo.get('nombre').toUpperCase())
        }
    }
})

module.exports = Periodo