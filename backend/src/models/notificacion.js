const {sequelize} = require('../config/sequelize.js')
const {DataTypes} =require('sequelize')
const {API_URL} = require('../config/config')

const Notificacion = sequelize.define('Notificacion', {
    id_notificacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            isNull: {
                msg: 'No ha proporcionado una descripción.'
            },
            len: {
                args: [5,100],
                msg: 'Pocos o demasiados caracteres.'
            }
        }
    },
    fecha_notificacion: {
        type: DataTypes.DATE,
        allowNull: false
    },
    leida: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
            is: {
                args: [/0-1/]
            }
        }
    },
    url: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            isNull: {
                msg: 'No se ha proporcionado una url para la notificacion.'
            }
        }
    }
},{
    tableName: 'notificacion',
    timestamps: false,
    hooks: {
        
    }
})

Notificacion.associate = function(models){
    models.Notificacion.belongsTo(models.Usuario,{
        foreignKey: {
            name: 'id_usuario',
            allowNull: false  
        },
        onDelete: 'CASCADE'
    })
}

module.exports = Notificacion