const {sequelize} = require('../config/sequelize.js')
const {DataTypes} =require('sequelize')

const Materia = sequelize.define('Materia',{
    nrc:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        unique:true,
        validate:{
            notNull:{
                args:true,
                msg:"El NRC no puede ser nulo"
            },
            is:{
                args:/[0-9]{5}/,
                msg:"El NRC es invalido"
            },
            len:{
                args:5,
                msg:"El NRC debe tener 5 digitos"
            }
        }
    },
    nombre:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notNull:{
                msg:"El nombre de materia es obligatorio"
            },
            is:{
                args:/^([a-záéíóúñ ]+)$/i,
                msg:"Caracteres invalidos"
            },
            len:{
                args:[5,25],
                msg:"La cantidad de caracteres no es valida"
            }
        },
        
    },
    clave:{
       type:DataTypes.STRING,
       allowNull:false,
       validate:{
           notNull:{
               msg:"La clave debe ser proporcionada"
           },
           is:{
                args:/(^)(ITIS|IDDS|ISTI|FGUS|CCOS|ICCS|ISCO)[\d]{3}/i,
                msg:"La clave de la materia no es valida"
           },
           len:{
               args:[7-8],
               msg:"La longitud de la clave debe estar entre los 7 y 8 caracteres"
           }
       }
    },
    seccion:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            notNull:{
                msg:"La seccion deve ser proporcionada"
            },
            is:{
                args:/[\d]{3}/,
                msg:"La seccion es un valor numerico"
            },
            len:{
                args:[5],
                msg:"La seccion tiene 5 cifras"
            }

        }
    }
},{
        tableName: 'materia',
        timestamps: false,
        hooks: {
            beforeSave: (periodo,options) => {
                periodo.set('nombre',periodo.get('nombre').toUpperCase())
                periodo.set('clave',periodo.get('clave').toUpperCase())
            }
        } 
})

Materia.associate = function(models){
    models.Materia.belongsTo(models.Profesor,{
        foreignKey:{
            name: 'profesor',
            allowNull: false
        },
        onDelete: 'CASCADE'
    })

    models.Materia.belongsToMany(models.Alumno,{
        through: models.CargaAcademica,
        foreignKey: 'materia_nrc'
    })

    models.Materia.belongsTo(models.Periodo,{
        foreignKey:{
            name: 'id_periodo',
            allowNull: false
        },
        onDelete: 'CASCADE'
    })  
}


module.exports=Materia;