const {sequelize} = require('../config/sequelize')
const {handleError} = require('./error.controller')

const getUsuariosEquipo = async (id_proyecto) => {
    const personas = await sequelize.models.Equipo.findAll({
        attributes: [
            [sequelize.col('Alumno.Persona.id_persona'),'id_persona']
        ],
        include: {
            model: sequelize.models.Alumno,
            attributes: [],
            include: {
                model: sequelize.models.Persona,
                attributes: [],
            }
        },
        where: {id_proyecto}
    })
    
    const ids_personas = personas.map(persona => persona.get('id_persona'))
    const usuarios = await sequelize.models.Usuario.findAll({
        attributes: ['id_usuario'],
        include: {
            model: sequelize.models.Persona,
            attributes: [],
            where: {id_persona: ids_personas}
        }
    })

    return usuarios
}

const getProyecto = async (id_entregable) => {
    const proyecto = await sequelize.models.Entregable.findOne({
        attributes: [
            [sequelize.col('Etapa.Proyecto.id_proyecto'),'id_proyecto'],
            [sequelize.col('Etapa.id_etapa'),'id_etapa']
        ],
        include: {
            model: sequelize.models.Etapa,
            attributes: [],
            include: {
                model: sequelize.models.Proyecto,
                attributes: []
            }
        },
        where: {id_entregable}
    })
    const usuarios = await getUsuariosEquipo(proyecto.get('id_proyecto'))
    
    return {
        id_proyecto: proyecto.get('id_proyecto'),
        id_etapa: proyecto.get('id_etapa'),
        usuarios
    }
}

const getProfesor = async (id_entregable) => {
    const profesor = await sequelize.models.Entregable.findOne({
        attributes: [
            [sequelize.col('Etapa.Proyecto.Materium.Profesor.Persona.nombre'),'nombre'],
            [sequelize.col('Etapa.Proyecto.Materium.Profesor.Persona.paterno'),'paterno']
        ],
        include: {
            model: sequelize.models.Etapa,
            attributes: [],
            include: {
                model: sequelize.models.Proyecto,
                attributes: [],
                include: {
                    model: sequelize.models.Materia,
                    attributes: [],
                    include: {
                        model: sequelize.models.Profesor,
                        attributes: [],
                        include: {
                            model: sequelize.models.Persona,
                            attributes: []
                        }
                    }
                }
            }
        },
        where: {id_entregable}
    })

    return profesor
}

exports.existsUsuario = async (req,res,next) => {
    const {id_usuario} = req.params
    const usuario = await sequelize.models.Usuario.findByPk(id_usuario)

    usuario ? 
        next() :
        res.sendStatus(404)
}

exports.existsNotificacion = async (req,res,next) => {
    const {id_notificacion} = req.params
    const notificacion = await sequelize.models.Notificacion.findByPk(id_notificacion)

    notificacion ? 
        next() :
        res.sendStatus(404)
}   

exports.getNotificaciones = async (req,res) => {
    const {id_usuario} = req.params
    const notificaciones = await sequelize.models.Notificacion.findAll({
        order: [
            ['fecha_notificacion','DESC']
        ],
        where: {id_usuario}
    })

    res.json(notificaciones)
}

exports.updateNotificacion = async (req,res) => {
    const {id_notificacion} = req.params
    const {leida} = req.body

    try{
        const notificacion = await sequelize.models.Notificacion.findByPk(id_notificacion)

        await notificacion.update({
            leida
        },{validate: false})

        res.sendStatus(201)
    }catch(err){
        handleError(req,res,err)
    }
}

exports.deleteNotificacion = async (req,res) => {
    const {id_notificacion} = req.params

    try{
        const notificacion = await sequelize.models.Notificacion.findByPk(id_notificacion)
        await notificacion.destroy()

        res.sendStatus(200)
    }catch(err){
        handleError(req,res,err)
    }
}

exports.sendNotificacionesNuevoEntregable = async (id_entregable) => {
    const proyecto = await getProyecto(id_entregable)
    const profesor = await getProfesor(id_entregable)

    proyecto.usuarios.forEach(async usuario => {
        await sequelize.models.Notificacion.create({
            id_usuario: usuario.id_usuario,
            descripcion: `${profesor.nombre} ${profesor.get('paterno')} ha asignado un nuevo entregable.`,
            fecha_notificacion: new Date(),
            url: `/alumno/misProyectos/${proyecto.id_proyecto}/etapas/${proyecto.id_etapa}/entregables/${id_entregable}`,
            leida: false
        },{validate: false})
    })
}

exports.sendNotificacionesUnirmeEquipo = (req,res) => {
    
}

exports.createNotificacionNuevaTarea = (req,res) => {

}