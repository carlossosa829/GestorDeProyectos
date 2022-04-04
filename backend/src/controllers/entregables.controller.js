const {sequelize} = require('../config/sequelize')
const {handleError} = require('./error.controller')
const ModelValidator = require('../validator/ModelValidator')

getEntregablesProyecto = (req,res) => {
    const {id_proyecto,id_etapa} = req.params
    
    sequelize.models.Entregable.findAll({
        include: {
            model: sequelize.models.Etapa,
            attributes: [],
            include: {
                model: sequelize.models.Proyecto,
                attributes: [],
                where: {id_proyecto}
            },
            where: {id_etapa}
        }
    })
    .then(entregables => res.json(entregables))
    .catch(err => handleError(req,res,err))
}

getEntregable = (req,res) => {
    const {id_entregable} = req.params

    sequelize.models.Entregable.findOne({
        include:{
            model: sequelize.models.Etapa,
            attributes: ['id_etapa','nombre'],
            include: {
                model: sequelize.models.Proyecto,
                attributes: ['id_proyecto','nombre_proyecto']
            }
        },
        where: {id_entregable}
    })
    .then(entregable => res.json(entregable))
    .catch(err => handleError(req,res,err))
}

existsEntregable = (req,res,next) => {
    const {id_entregable} = req.params

    sequelize.models.Entregable.findOne({
        attributes: ['id_entregable'],
        include:{
            model: sequelize.models.Etapa,
        },
        where: {id_entregable}
    })
    .then(entregable =>
        entregable ? next() : res.sendStatus(404)
    )
    .catch(err => handleError(req,res,err))
}

descargarRubrica = (req,res) => {
    const {id_entregable} = req.params
    const path_entregables = 'src/archivos'

    sequelize.models.Entregable.findOne({
        attributes: ['id_entregable','url_rubrica'],
        where: {id_entregable}
    })
    .then(entregable =>{
        const archivo = entregable.url_rubrica
        
        archivo ?
            res.download(`${path_entregables}/${archivo}`) :
            res.sendStatus(404)
    })
    .catch(err => handleError(req,res,err))
}

descargarEntregable = (req,res) => {
    const {id_entregable} = req.params
    const path_entregables = 'src/archivos'

    sequelize.models.Entregable.findOne({
        attributes: ['id_entregable','url_entregable'],
        where: {id_entregable}
    })
    .then(entregable =>{
        const archivo = entregable.url_entregable
        
        archivo ?
            res.download(`${path_entregables}/${archivo}`) :
            res.sendStatus(404)
    })
    .catch(err => handleError(req,res,err))
}

verEntregable = (req,res) => {
    const {id_entregable} = req.params
    const path_entregables = 'src/archivos'

    sequelize.models.Entregable.findOne({
        attributes: ['id_entregable','url_entregable'],
        where: {id_entregable}
    })
    .then(entregable =>{
        const archivo = entregable.url_entregable
        if(archivo){
            lSlash = __dirname.lastIndexOf('\\')
            absolutePath = __dirname.slice(0,lSlash)
            res.sendFile(`${absolutePath}\\archivos\\${archivo}`) 
        }
        else res.sendStatus(404)
    })
    .catch(err => handleError(req,res,err))
}

subirEntregable = async (req,res) => {
    const {id_entregable} = req.params
    console.log(id_entregable)
    const {entregable} = req.files
    console.log(entregable)
    const extension = getExtension(entregable.name)
    console.log(extension)
    const filename = `${req.params.id_entregable}_entregable${extension}`
    const path = `src/archivos/${filename}`
    
    try{
        await entregable.mv(path)
        await actualizarEntregable(id_entregable,filename)
        res.status(201).send({message: 'Entregable enviado'})
    }catch(err){
        handleError(req,res,err)
    }
}

calificar = async (req,res) => {
    try{
        const {id_entregable} = req.params
        const {observaciones,calificacion} = req.body
        await calificarEntregable(id_entregable,observaciones,calificacion)
        res.status(201).send({ message : 'Entregable creado' })
    }catch(err){
        handleError(req,res,err)
    }
    
}

getExtension = (filename) => {
    const name = filename.split('.')

    return name.length < 1 ?
        '' :
        `.${name[name.length-1]}`
} 

async function calificarEntregable(id_entregable,observaciones,calificacion){
    try{
        const entregable = await sequelize.models.Entregable.findByPk(id_entregable)
        await entregable.update({
            devuelto: true,
            calificacion,
            observaciones
        })
    } catch(err){
        throw(err)
    }
}

 async function actualizarEntregable(id_entregable,nombre_entregable){
    try{
        const entregable =  await sequelize.models.Entregable.findByPk(id_entregable)
        await entregable.update({
            entregado: true,
            url_entregable: nombre_entregable,
            fecha_entrega: Date.now(),
            
        })
    } catch(err){
        throw err
    }
}

module.exports={
    getExtension,
    calificar,
    subirEntregable,
    descargarEntregable,
    descargarRubrica,
    existsEntregable,
    getEntregable,
    getEntregablesProyecto,
    verEntregable
}