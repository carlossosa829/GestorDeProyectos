const {sequelize} = require('../config/sequelize.js')
const {DataTypes} = require('sequelize')

const Equipo = sequelize.define('Equipo',{
    id_proyecto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: 'El id del proyecto debe ser proporcionado.'
            },
            async isValid(value) {
                let proyecto = await sequelize.models.Proyecto.findOne({where: {id_proyecto: value}})
                if(!proyecto)
                    throw new Error('No existe un proyecto con el id proporcionado.')
            }
        }
    },
    matricula: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: 'La matricula del alumno debe ser proporcionada.'
            },
            async isValid(value) {
                let alumno = await sequelize.models.Alumno.findOne({where: {matricula: value}})
                if(!alumno)
                    throw new Error('No un alumno con la matricula proporcionada.')
            }
        }
    },
    estado: {
        type: DataTypes.STRING(45),
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: 'El estado del alumno debe ser proporcionado.'
            },
            isIn: {
                args: [['ACEPTADO','PENDIENTE','RECHAZADO']],
                msg: 'El estado proporcionado no es válido.'
            }
        }
    },
    rol: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El rol del integrante debe ser proporcionado.'
            },
            isIn: {
                args: [['LIDER','INTEGRANTE']],
                msg: 'El rol proporcionado no es válido.'
            }
        }
    }
},{
    timestamps: false,
    tableName: 'equipo'
})

Equipo.associate = function(models){
    models.Equipo.belongsTo(models.Proyecto,{
        foreignKey: {
            name: 'id_proyecto',
            allowNull: false
        },
        onDelete: 'CASCADE'
    })

    models.Equipo.belongsTo(models.Alumno,{
        foreignKey: {
            name: 'matricula',
            allowNull: false
        },
        onDelete: 'CASCADE'
    })
}

module.exports = Equipo