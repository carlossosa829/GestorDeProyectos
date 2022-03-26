const {sequelize} = require('../config/sequelize')
const {handleError} = require('./error.controller')
const ModelValidator = require('../validator/ModelValidator')

exports.getIntegrantes = (req,res) => {
    const {id_proyecto} = req.params

    sequelize.models.Equipo.findAll({
        attributes: [
            'id_proyecto',
            'matricula',
            'estado',
            'rol',
            [sequelize.col('Alumno.Persona.nombre'),'nombre'],
            [sequelize.col('Alumno.Persona.paterno'),'paterno'],
            [sequelize.col('Alumno.Persona.materno'),'materno'],
        ],
        include:{
            model: sequelize.models.Alumno,
            attributes: [],
            include: {
                model: sequelize.models.Persona,
                attributes: []
            }
        },
        where: {id_proyecto}
    })
    .then(equipo => res.json(equipo))
    .catch(err => handleError(req,res,err))
}

exports.agregarIntegrante = async (req,res) => {
    const {id_proyecto} = req.params
    const {matricula} = req.body

    try{
        await sequelize.models.Equipo.create({
            id_proyecto,
            matricula,
            rol: 'INTEGRANTE',
            estado: 'PENDIENTE'
        })
        res.sendStatus(201)
    }catch(err){
        handleError(req,res,err)
    }
}

exports.eliminarIntegrante = async (req,res) => {
    const {id_proyecto} = req.params
    const {matricula} = req.body

    try{
        const integrante = await sequelize.models.Equipo.findOne({
            where: {
                id_proyecto,
                matricula
            }
        })

        if(!integrante)
            return res.sendStatus(404)

        await integrante.destroy()
        res.sendStatus(201)
    }catch(err){
        handleError(req,res,err)
    }
}