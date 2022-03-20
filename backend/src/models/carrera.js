const {sequelize} = require('../config/sequelize')
const {DataTypes} = require('sequelize')

const Carrera = sequelize.define('Carrera',{
    id_carrera: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        validate: {
            notNull:{
                msg: 'El id de la carrera debe ser proporcionado.'
            }
        }
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notNull:{
                args: true,
                msg: 'El nombre debe ser proporcionado.'
            },
            is: {
                args: /[a-záéíóú ]+/i,
                msg: 'El nombre solo puede contener carácteres alfabeticos.'
            },
            len:{
                args: [5-50],
                msg: 'El nombre es demasiado corto o largo.'
            }
        }
    }
},{
    tableName: 'carrera',
    timestamps: false,
    beforeSave: (carrera,options) => {
        carrera.set('nombre',carrera.get('nombre').toUpperCase())
    }
})

module.exports = Carrera