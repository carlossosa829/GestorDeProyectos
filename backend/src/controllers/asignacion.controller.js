const {sequelize} = require('../config/sequelize')
const {handleError} = require('./error.controller')

async function getAsignacines(req,res){
    const {id_proyecto} = req.params;
    await
        sequelize.query(`
            SELECT etapa.nombre as etapa,proyecto.id_proyecto,entregable.id_entregable,entregable.nombre,entregable.descripcion,entregable.fecha_asignacion,
            entregable.entregado,entregable.descripcion,entregable.calificacion 
            FROM entregable,proyecto,etapa
            WHERE proyecto.id_proyecto=etapa.id_proyecto AND etapa.id_etapa = entregable.id_etapa 
            AND proyecto.id_proyecto=${id_proyecto}`)
        .then(([entregables,metadata]) => {
                res.json(entregables)
        })
        .catch(error => handleError(error))


}

async function getAsignacinesCompletas(req,res){
    const {id_proyecto} = req.params
    console.log(id_proyecto);
    await
    sequelize.query(`
    SELECT proyecto.id_proyecto,entregable.id_entregable,entregable.nombre,entregable.fecha_asignacion,
    entregable.fecha_limite,entregable.observaciones,entregable.descripcion,entregable.fecha_entrega,entregable.entregado,entregable.calificacion
    FROM entregable,proyecto,etapa
    WHERE proyecto.id_proyecto=etapa.id_proyecto AND etapa.id_etapa = entregable.id_etapa
    AND proyecto.id_proyecto=${id_proyecto}`)
    .then(([entregables,metadata])=>{
        res.json(entregables)
    })
    .catch(error=>handleError(error))
}

module.exports={
    getAsignacines,
    getAsignacinesCompletas
}