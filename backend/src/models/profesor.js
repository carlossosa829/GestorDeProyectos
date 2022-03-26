const {sequelize} = require('../config/sequelize')
const {DataTypes} = require('sequelize')

const Profesor = sequelize.define('Profesor',{
    matricula: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                args: true,
                msg: 'La matrícula debe ser proporcionada.'
            },
            is: {
                args: /20[123][\d]{6}/,
                msg: 'La matrícula es inválida.'
            },
            len: {
                args: 9,
                msg: 'La matrícula debe tener longitud 9.'
            }
        }
    }
},{
    tableName: 'profesor',
    timestamps: false,
    hooks:{

    }
})

Profesor.associate = function(models){
    models.Profesor.belongsTo(models.Persona,{
        foreignKey:{
            name: 'id_persona',
            allowNull: false
        },
        onDelete: 'CASCADE'
    })
}

module.exports = Profesor