const {sequelize} = require('../config/sequelize')
const {DataTypes} = require('sequelize')
const bcrypt = require('bcrypt')

const Usuario = sequelize.define('Usuario',{
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(80),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El email debe ser proporcionado.'
            },
            isEmail: {
                args: true,
                msg: 'El email proporcionado no es válido.'
            }
        }
    },
    contrasena: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La contraseña debe ser proporcionada.'
            },
            len: {
                args: [8-60],
                msg: 'La contraseña no puede tener menos de 8 caracteres.'
            }
        }
    },
    rol: {
        type: DataTypes.STRING(45),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El rol debe ser proporcionado.'
            },
            isIn: {
                args: [['ALUMNO','PROFESOR','USUARIO']],
                msg: 'El rol proporcionado es inválido.'
            }
        }
    },
    foto: {
        type: DataTypes.STRING,
        allowNull: true,
    }
},{
    tableName: 'usuario',
    timestamps: false,
    hooks: {
        beforeSave: async (usuario,options) => {
            usuario.set('email',usuario.get('email').toLowerCase())
            usuario.set('rol',usuario.get('rol').toUpperCase())

            //HASHING PASSWORD
            const salt = await bcrypt.genSalt(10)
            usuario.contrasena =await bcrypt.hash(usuario.contrasena,salt)
        },
        beforeValidate: (usuario,options) => {
            usuario.set('rol',usuario.get('rol').toUpperCase())
        }
    }
})

Usuario.prototype.comparePassword = async (password,hashedPassword) => {
    return await bcrypt.compare(password,hashedPassword)
}

Usuario.associate = function(models){
    models.Usuario.belongsTo(models.Persona,{
        foreignKey: {
            name: 'id_persona',
            allowNull: false
        },
        onDelete: 'CASCADE'
    })
}

module.exports = Usuario