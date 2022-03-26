const {sequelize} = require('../config/sequelize')
const {handleError} = require('./error.controller')
const ModelValidator = require('../validator/ModelValidator')

function existsAlumno(req,res,next){
    sequelize.models.Alumno.findOne({where: {matricula: req.params.matricula}})
        .then(alumno => {
            if(alumno)
                next()
            else
                res.sendStatus(404)
        })
        .catch(err =>
            handleError(req,res,err))   
}

function existsProyecto(req,res,next){
    sequelize.models.Proyecto.findOne({where: {id_proyecto: req.params.id_proyecto}})
        .then(proyecto => {
            if(proyecto)
                next()
            else
                res.sendStatus(404)
        })
        .catch(err =>
            handleError(req,res,err))   
}

function buildProyecto(body){
    return sequelize.models.Proyecto.build({
        nombre_proyecto: body.nombre_proyecto,
        fecha_inicio: body.fecha_inicio,
        fecha_limite: body.fecha_limite || null,
        fecha_fin: body.fecha_fin || null,
        descripcion: body.descripcion,
        nrc: body.nrc,
        coordinador: body.coordinador
    })
}

function buildEquipo(body,id_proyecto){
    const equipo = body.equipo || []
    const coordinador = body.coordinador
    let modelos = []

    if(!equipo.includes(coordinador))
        equipo.push(coordinador)

    for(let matricula of equipo){
        modelos.push(sequelize.models.Equipo.build({
            id_proyecto,
            matricula,
            estado: coordinador === matricula ? 'ACEPTADO' : 'PENDIENTE',
            rol: coordinador === matricula ? 'LIDER' : 'INTEGRANTE'
        }))
    }

    return modelos
}

async function createProyecto(req,res){
    let proyecto = buildProyecto(req.body)
    let equipo

    try{    
        await sequelize.transaction(async t => {
            proyecto = await proyecto.save({transaction: t,validate: false})
            
            equipo = buildEquipo(req.body,proyecto.get('id_proyecto'))
            
            for(let integrante of equipo){
                await integrante.save({transaction: t,validate: false})
            }
        })

        return res.sendStatus(201)
    }
    catch(err){
        handleError(req,res,err)
    }
}

function validateProyecto(requestType){
    return async (req,res,next) => {
        let proyecto = buildProyecto(req.body)

        let validator = new ModelValidator()

        try{
            let skip = ['id_proyecto']

            if(requestType === 'put')
                skip = ['id_proyecto','nrc','coordinador']

            await validator.validate(proyecto,{skip})
        }
        catch(err){
            return handleError(req,res,err)
        }
        
        let validationErrors = validator.getErrors()

        if(validationErrors)
            return res.status(422).json({errors: validationErrors})

        next()
    }
}

function getProyectosAlumno(req,res){
    sequelize.models.Alumno.findOne({
        attributes: [
        ],
        include: {all:true,nested:true},
        where: {matricula: req.params.matricula}
    })
    .then(async proyectos => {
        if(!proyectos)
            return []
        return await res.json(proyectos.Proyectos)
    })
    .catch(err => handleError(req,res,err))
}

function findDetalles(req,res){
    const {id_proyecto} = req.params;
    
    sequelize.models.Proyecto.findOne({
        include: {
            model: sequelize.models.Materia,
            attributes: [],
            include: {
                model: sequelize.models.Profesor,
                include: {
                    model: sequelize.models.Persona
                }
            }
        },
        attributes: [
            'id_proyecto',
            'nombre_proyecto',
            'fecha_inicio',
            'fecha_limite',
            'fecha_fin',
            'descripcion',
            [sequelize.col('Materium.nombre'),'materia'],
            [sequelize.col('Materium.nrc'),'nrc'],
            [sequelize.col('Materium.Profesor.Persona.nombre'),'profesor_nombre'],
            [sequelize.col('Materium.Profesor.Persona.paterno'),'profesor_paterno'],
            [sequelize.col('Materium.Profesor.Persona.materno'),'profesor_materno']
        ],
        where: {id_proyecto}
    })
    .then(proyecto => {
        if(!proyecto)
            return res.sendStatus(404)

        proyecto.dataValues.profesor =  `${proyecto.dataValues.profesor_nombre} ${proyecto.dataValues.profesor_paterno} ${proyecto.dataValues.profesor_materno}`
        delete proyecto.dataValues['profesor_nombre']
        delete proyecto.dataValues['profesor_paterno']
        delete proyecto.dataValues['profesor_materno']

        return res.json(proyecto)
    })
    .catch(err => {
        handleError(req,res,err)
    })
}

async function updateProyecto(req,res){
    try{
        let proyecto = await sequelize.models.Proyecto.findOne({where: {id_proyecto: req.params.id_proyecto}})

        await sequelize.transaction(async t => {
            //UPDATING PROYECTO
            await proyecto.update({
                nombre_proyecto: req.body.nombre_proyecto,
                fecha_inicio: req.body.fecha_inicio,
                fecha_limite: (req.body.fecha_limite || null),
                fecha_fin: (req.body.fecha_fin || null),
                descripcion: req.body.descripcion
            },{
                transaction: t,
                validate: false
            })
        })

        res.sendStatus(200)
    }
    catch(err){
        handleError(req,res,err)
    }
}

async function deleteProyecto(req,res){
    try{
        const proyecto = await sequelize.models.Proyecto.findOne({where: {id_proyecto: req.params.id_proyecto}})

        await sequelize.transaction(async t => {
            await proyecto.destroy({transaction: t})
        })

        res.sendStatus(200)
    }
    catch(err){
        handleError(req,res,err)
    }
}

async function getEntregables(req,res){
    const {id_proyecto} = req.params
    
    try{
        const entregables = await sequelize.models.Entregable.findAll({
            attributes: [
                'id_entregable',
                [sequelize.col('Etapa.nombre'),'etapa'],
                [sequelize.col('Etapa.id_etapa'),'id_etapa'],
                'nombre',
                'entregado',
                'fecha_limite',
                'calificacion'
            ],
            include: {
                model: sequelize.models.Etapa,
                attributes: [],
                includes: {
                    model: sequelize.models.Proyecto,
                    attributes: []
                },
                where: {id_proyecto}
            }
        })

        res.json(entregables)
    } catch(err){
        handleError(req,res,err)
    }
}

module.exports = {
    validateProyecto,
    createProyecto,
    getProyectosAlumno,
    existsAlumno,
    findDetalles,
    updateProyecto,
    existsProyecto,
    deleteProyecto,
    getEntregables
}