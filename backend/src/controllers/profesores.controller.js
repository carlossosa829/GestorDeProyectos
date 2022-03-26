const {sequelize} = require('../config/sequelize')
const {handleError} = require('./error.controller')
const ModelValidator = require('../validator/ModelValidator')

function buildPersona(body){
    return sequelize.models.Persona.build({
        nombre: body.nombre,
        paterno: body.paterno,
        materno: body.materno,
        sexo: body.sexo
    })
}

function buildProfesor(body){
    return sequelize.models.Profesor.build({
        matricula: body.matricula
    })
}

function buildUsuario(body){
    return sequelize.models.Usuario.build({
        email:body.email,
        contrasena:body.contrasena,
        rol:body.rol
    })
}

function existsProfesor(req,res,next){
    sequelize.models.Profesor.findOne({where: {matricula: req.params.matricula}})
    .then(profesor => {
        if(profesor)
            next()
        else
            res.sendStatus(404)
    })
    .catch(err => handleError(req,res,err))
}

function validateProfesor(requestType){
    return async (req,res,next) => {
        const persona = buildPersona(req.body)
        const profesor = buildProfesor(req.body)
        const usuario = buildUsuario(req.body)

        const validator = new ModelValidator

        try{
            await validator.validate(persona,{skip: ['id_persona']})
            await validator.validate(profesor,{skip: ['id_persona']})
            await validator.validate(usuario,{skip: ['id_persona']})

            if(requestType === 'post'){
                const matriculaOcupied = await sequelize.models.Profesor.findOne({where: {matricula: profesor.matricula}})

                if(matriculaOcupied){
                    validator.addError('matricula','La matrícula ingresada ya se encuentra registrada.')
                }
            }
        }catch(err){
            return handleError(req,res,err)
        }

        let validationErrors = validator.getErrors()

        if(validationErrors)
            return res.status(422).json({errors: validationErrors})
        
        next()
    }
}

function getProfesores(req,res){
    sequelize.models.Profesor.findAll({
        attributes: [
            'matricula',
            [sequelize.col('Persona.nombre'),'nombre'],
            [sequelize.col('Persona.paterno'),'paterno'],
            [sequelize.col('Persona.materno'),'materno']
        ],
        include: [
            {
                model: sequelize.models.Persona,
                attributes: []
            }
        ]
    })
    .then(profesores => res.json(profesores))
    .catch(err => handleError(req,res,err))
}

function getProfesor(req,res){
    sequelize.models.Profesor.findOne({
        attributes: [
            'matricula',
            [sequelize.col('Persona.nombre'),'nombre'],
            [sequelize.col('Persona.paterno'),'paterno'],
            [sequelize.col('Persona.materno'),'materno']
        ],
        include: [
            {
                model: sequelize.models.Persona,
                attributes: [],
                include: [
                    {
                        
                    }
                ]
            }
        ],
        where: {matricula: req.params.matricula}
    })
    .then(profesor => {
        if(!profesor) return res.sendStatus(404)

        res.json(profesor)
    })
    .catch(err => handleError(req,res,err))
}

async function createProfesor(req,res){
    let persona = buildPersona(req.body)
    const profesor = buildProfesor(req.body)
    let usuario = buildUsuario(req.body)

    try{
        await sequelize.transaction(async t => {
            persona = await persona.save({transaction: t, validate: false})
            profesor.set('id_persona',persona.get('id_persona'))
            await profesor.save({transaction: t, validate: false})
            usuario.set('id_persona',persona.get('id_persona'))
            await usuario.save({transaction: t,validate: false})
        })

        return res.sendStatus(201)
    }catch(err){
        handleError(req,res,err)
    }
}

async function updateProfesor(req,res){
    try{
        let profesor = await sequelize.models.Profesor.findOne({where: {matricula: req.params.matricula}})
        let persona =  await sequelize.models.Persona.findOne({where: {id_persona: profesor.get('id_persona')}})
        
        await sequelize.transaction(async t => {
            //UPDATING PERSON INFO
            await persona.update({
                nombre: req.body.nombre,
                paterno: req.body.paterno,
                materno: req.body.materno,
                sexo: req.body.sexo
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

async function deleteProfesor(req,res){
    try{
        const profesor = await sequelize.models.Profesor.findOne({where: {matricula: req.params.matricula}})
        const id_persona = profesor.get('id_persona')

        await (await sequelize.models.Persona.findOne({where: {id_persona}})).destroy()

        res.sendStatus(200)
    }
    catch(err){
        handleError(req,res,err)
    }
}

async function getMaterias(req,res){
    const {matricula} = req.params;

    await sequelize.query(`
        SELECT materia.nrc, materia.nombre, periodo.nombre as Pnombre FROM periodo
        INNER JOIN materia ON periodo.id_periodo = materia.id_periodo
        INNER JOIN profesor ON profesor.matricula = materia.profesor
        WHERE profesor.matricula=${matricula}`)
    .then(([result,metadata]) => res.json(result))
    .catch(error => handleError(req,res,error))
}

module.exports = {
    getProfesores,
    getProfesor,
    validateProfesor,
    existsProfesor,
    createProfesor,
    updateProfesor,
    deleteProfesor,
    getMaterias
}