const {sequelize} = require('../config/sequelize.js')
const {DataTypes} = require('sequelize')

const Proyecto = sequelize.define('Proyecto',{
    id_proyecto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    nombre_proyecto: {
        type: DataTypes.STRING(45),
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: 'El nombre debe ser proporcionado.'
            },
            len:{
                args: [5,45],
                msg: 'Pocos o demasiados caracteres.'
            }
        }
    },
    fecha_inicio:{
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue:  DataTypes.DATE.NOW,
        validate: {
            notNull: {
                args: true,
                msg: 'La fecha de inicio debe ser proporcionada.'
            },
            isDate: {
                args: true,
                msg: 'La fecha de inicio no contiene un formato válido.'
            }
        }
    },
    fecha_limite:{
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate: {
                args: true,
                msg: 'La fecha límite no contiene un formato válido.'
            }
        }
    },
    fecha_fin:{
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate: {
                args: true,
                msg: 'La fecha fin no contiene un formato válido.'
            }
        }
    },
    descripcion:{
        type: DataTypes.STRING(200),
        allowNull: true,
        validate: {
            len: {
                args: [0,200],
                msg: 'Pocos o demasiados caracteres.'
            }
        }
    },
    nrc: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: sequelize.models.Materia,
            key: 'nrc'
        },
        validate: {
            notNull: {
                args: true,
                msg: 'El nrc de la materia debe ser proporcionado.'
            },
            async isValid(value) {
                let materia = await sequelize.models.Materia.findOne({where: {nrc: value}})
                if(!materia)
                    throw new Error('No es un nrc válido.')
            }
        }
    }
},{
    tableName: 'proyecto',
    timestamps: false,
    hooks: {
        beforeSave: (proyecto,options) => {
            proyecto.set('nombre_proyecto',proyecto.get('nombre_proyecto').toUpperCase())
            proyecto.set('descripcion',proyecto.get('descripcion').toUpperCase())
        }
    }
})

Proyecto.associate = function(models){
    models.Proyecto.belongsTo(models.Materia,{
        foreignKey: {
            name: 'nrc',
            allowNull: false
        },
        onDelete: 'CASCADE'
    })
    
    models.Proyecto.belongsToMany(models.Alumno,{
        through: models.Equipo,
        foreignKey: 'id_proyecto'
    })
}

module.exports = Proyecto