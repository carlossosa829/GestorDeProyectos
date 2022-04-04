const {sequelize} = require('../config/sequelize.js')
const {DataTypes} =require('sequelize')

const Etapa = sequelize.define('Etapa',{
    id_etapa: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        validate: {
            notNull: {
                args: true,
                msg: 'El id de la etapa debe ser proporcionado.'
            }
        }
    },
    nombre: {
        type: DataTypes.STRING(45),
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: 'El nombre de la etapa debe se proporcionado.'
            },
            len: {
                args: [4,45],
                msg: 'Pocos o demasiados caracteres.'
            }
        }
    },
    id_proyecto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: sequelize.models.Proyecto,
        validate: {
            notNull: {
                args: true,
                msg: 'El id del proyecto debe se proporcionado.'
            }
        }
    },
    fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: 'La fecha de inicio debe ser proporcionada.'
            },
            isDate:{
                args: true,
                msg: 'La fecha de inicio no tiene un formato válido.'
            }
        }
    },
    fecha_fin: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate:{
                args: true,
                msg: 'La fecha de fin no tiene un formato válido.'
            }
        }
    },
    estado: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El estado del proyecto debe ser proporcionado.'
            },
            isIn: {
                args: [['EN PROCESO','FINALIZADA']],
                msg: 'El estado proporcionado no es válido.'
            }
        }
    }
},{
    tableName: 'etapa',
    timestamps: false,
    hooks: {
        beforeSave(etapa,options) {
            etapa.set('nombre',etapa.get('nombre').toUpperCase())
            etapa.set('estado',etapa.get('estado').toUpperCase())
        },
        beforeValidate(etapa,options){
            etapa.set('estado',etapa.get('estado').toUpperCase())
        }
    }
})

Etapa.associate = function(models){
    models.Etapa.belongsTo(models.Proyecto,{
        foreignKey: {
            name: 'id_proyecto',
            allowNull: false
        },
        onDelete: 'CASCADE'
    })
}

module.exports = Etapa