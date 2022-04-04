const {sequelize} = require('../config/sequelize.js')
const {DataTypes} =require('sequelize')

const Entregable = sequelize.define('Entregable',{
    id_entregable: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement:true,
        validate: {
            notNull:{
                msg: 'El id del entregable debe ser proporcionado.'
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
    },
    descripcion:{
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notNull:{
                args: true,
                msg: 'La descripción debe ser proporcionado.'
            },
            is: {
                args: /[a-záéíóú ]+/i,
                msg: 'La descripcion  solo puede contener carácteres alfabeticos.'
            },
            len:{
                args: [5-50],
                msg: 'La descripción es demasiado corto o largo.'
            }
        }
    },
    url_rubrica: {
        type: DataTypes.STRING(355),
        allowNull: true,
    },
    url_entregable: {
        type: DataTypes.STRING(355),
        allowNull: true,
    },
    calificacion: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            isFloat: {
                msg: 'La calificación no tiene un formato válido.'
            }
        }
    },
    observaciones: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    fecha_asignacion: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notNull:{
                args: true,
                msg: 'La fecha de asignación debe ser proporcionada.'
            },
            isDate:{
                msg: 'La fecha de asignación no tiene un formato válido.'
            }
        }
    },
    fecha_limite: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notNull:{
                args: true,
                msg: 'La fecha límite debe ser proporcionada.'
            },
            isDate:{
                msg: 'La fecha límite no tiene un formato válido.'
            }
        }
    },
    fecha_entrega: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
            isDate:{
                msg: 'La fecha de entrega no tiene un formato válido.'
            }
        }
    },
    entregado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        validate: {
            notNull: {
                msg: 'Tiene que indicar si la tarea ha sido entregada.'
            }
        }
    },
    devuelto: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        validate: {
            notNull: {
                msg: 'Tiene que indicar si la tarea ha sido devuelta.'
            }
        }
    }
},{
    tableName: 'entregable',
    timestamps: false,
    hooks:{
        beforeSave: (entregable,options) => {
            entregable.set('nombre',entregable.get('nombre').toUpperCase())
            entregable.set('descripcion',entregable.get('descripcion').toUpperCase())
            if(entregable.get('observaciones'))
                entregable.set('observaciones',entregable.get('observaciones').toUpperCase())
        }
    }
})

Entregable.associate = function(models){
    models.Entregable.belongsTo(models.Etapa,{
        foreignKey: {
            name: 'id_etapa',
            allowNull: false
        },
        onDelete: 'CASCADE'
    })
}

module.exports = Entregable