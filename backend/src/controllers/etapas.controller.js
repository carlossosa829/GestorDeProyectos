const {sequelize} = require('../config/sequelize')
const {handleError} = require('./error.controller')
const ModelValidator = require('../validator/ModelValidator')

function existsEtapa(req,res,next){
    const {id_proyecto,id_etapa} = req.params

    sequelize.models.Etapa.findOne({
        where: {
            id_proyecto,
            id_etapa
        }
    })
    .then(etapa => etapa ? next() : res.sendStatus(404))
    .catch(err => handleError(req,res,err))  
}

function buildEtapa(req){
    const {id_proyecto} = req.params
    const {nombre,fecha_inicio,fecha_fin} = req.body

    return sequelize.models.Etapa.build({
        nombre,
        id_proyecto,
        fecha_inicio,
        fecha_fin: (fecha_fin || null),
        estado: (fecha_fin ? 'FINALIZADA' : 'EN PROCESO')
    })
}

function validateEtapa(requestType){
    return async (req,res,next) => {
        let etapa = buildEtapa(req)

        let validator = new ModelValidator()

        try{
            let skip = ['id_etapa']

            if(requestType === 'put')
                skip = ['id_etapa']

            await validator.validate(etapa,{skip})
        } catch(err){
            return handleError(req,res,err)
        }
        
        let validationErrors = validator.getErrors()

        if(validationErrors)
            return res.status(422).json({errors: validationErrors})

        next()
    }
}

async function createEtapa(req,res){
    const etapa = buildEtapa(req)
    
    try{
        await etapa.save({validate: false})
        return res.sendStatus(201)
    } catch(err){
        handleError(req,res,err)
    }
}

async function updateEtapa(req,res){
    const {id_proyecto,id_etapa} = req.params

    try{
        const etapa = await sequelize.models.Etapa.findOne({
            where: {
                id_proyecto,
                id_etapa
            }
        })

        await etapa.update({
            nombre: req.body.nombre,
            fecha_inicio: req.body.fecha_inicio,
            fecha_fin: (req.body.fecha_fin || null),
            estado: (req.body.fecha_fin ? 'FINALIZADA' : 'EN PROCESO')
        },{
            validate: false
        })

        res.sendStatus(200)
    }
    catch(err){
        handleError(req,res,err)
    }
}

function getEtapas(req,res){
    const {id_proyecto} = req.params

    sequelize.models.Etapa.findAll({
        where: {id_proyecto}
    })
    .then(etapas => res.json(etapas))
    .catch(err => handleError(req,res,err))
}

function getEtapa(req,res){
    const {id_proyecto,id_etapa} = req.params

    sequelize.models.Etapa.findOne({
        where: {
            id_proyecto,
            id_etapa
        }
    })
    .then(etapa => res.json(etapa))
    .catch(err => handleError(req,res,err))
}

async function deleteEtapa(req,res){
    const {id_proyecto,id_etapa} = req.params

    try{
        const etapa = await sequelize.models.Etapa.findOne({
            where: {
                id_proyecto,
                id_etapa
            }
        })

        await etapa.destroy()
        res.sendStatus(200)
    }
    catch(err){
        handleError(req,res,err)
    }
}

module.exports = {
    validateEtapa,
    createEtapa,
    getEtapas,
    getEtapa,
    updateEtapa,
    existsEtapa,
    deleteEtapa
}