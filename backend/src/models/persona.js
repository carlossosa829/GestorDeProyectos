const {sequelize} = require('../config/sequelize')
const {DataTypes} = require('sequelize')

const Persona = sequelize.define('Persona',{
    id_persona: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    nombre:{
        type: DataTypes.STRING(45),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El nombre debe ser proporcionado.'
            },
            is: {
                args: /^([a-záéíóúñ ]+)$/i,
                msg: 'Caracteres inválidos.'
            },
            len: {
                args: [2,45],
                msg: 'Pocos o demasiados caracteres.'
            }
        }
    },
    paterno:{
        type: DataTypes.STRING(45),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El apellido paterno debe ser proporcionado.'
            },
            is: {
                args: /^([a-záéíóúñ ]+)$/i,
                msg: 'Caracteres inválidos.'
            },
            len: {
                args: [2,45],
                msg: 'Pocos o demasiados caracteres.'
            }
        }
    },
    materno:{
        type: DataTypes.STRING(45),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El apellido materno debe ser proporcionado.'
            },
            is: {
                args: /^([a-záéíóúñ ]+)$/i,
                msg: 'Caracteres inválidos.'
            },
            len: {
                args: [2,45],
                msg: 'Pocos o demasiados caracteres.'
            }
        }
    },
    sexo:{
        type: DataTypes.CHAR(1),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El sexo debe ser proporcionado.'
            },
            len: {
                args: [1,1],
                msg: 'Pocos o demasiados caracteres.'
            },
            is:{
                args: /[hm]/i,
                msg: 'Sexo inválido.'
            }
        }
    }
},{
    tableName: 'persona',
    timestamps: false,
    hooks: {
        beforeSave: (persona,options) => {
            persona.set('nombre',persona.get('nombre').toUpperCase())
            persona.set('paterno',persona.get('paterno').toUpperCase())
            persona.set('materno',persona.get('materno').toUpperCase())
            persona.set('sexo',persona.get('sexo').toUpperCase())
        }
    }
})

module.exports = Persona