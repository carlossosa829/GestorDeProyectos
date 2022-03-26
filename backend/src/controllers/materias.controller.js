const {sequelize} = require('../config/sequelize')
const {handleError} = require('./error.controller')

function getMaterias(req,res) {
    sequelize.models.Materia.findAll()
    .then(materias => res.json(materias))
    .catch(err => handleError(req,res,err))
}

async function existsMateria(req,res,next){
    await sequelize.models.Materia.findOne({
        where: {nrc: req.params.nrc}
    })
    .then(materia => {
        if(!materia) return res.sendStatus(404)

        next()
    })
    .catch(err => handleError(req,res,err))
}

function getAlumnosIncritos(req,res){
    sequelize.models.Materia.findOne({
        attributes: [
            'nrc',
            'nombre',
            'clave',
            'seccion',
            'profesor',
            [sequelize.col('Alumnos.matricula'),'Alumnos.matricula'],
            [sequelize.col('Alumnos.Persona.nombre'),'Alumnos.nombre'],
            [sequelize.col('Alumnos.Persona.paterno'),'Alumnos.paterno'],
            [sequelize.col('Alumnos.Persona.materno'),'Alumnos.materno'],
        ],
        include: [
            {
                model: sequelize.models.Alumno,
                through: {
                    attributes: []
                },
                include: [
                    {
                        model: sequelize.models.Persona,
                        attributes: []
                    }
                ]
            }
        ],
        where: {nrc: req.params.nrc}
    })
    .then(lista => res.json(lista))
    .catch(err => handleError(req,res,err))
}

async function getEntregables(req,res){
    const {nrc} = req.params;
    await 
    sequelize.query(`
    SELECT entregable.calificacion,entregable.fecha_entrega,entregable.fecha_limite,entregable.entregado,proyecto.id_proyecto
    FROM entregable,etapa,proyecto
    WHERE entregable.id_etapa = etapa.id_etapa
    	AND etapa.id_proyecto = proyecto.id_proyecto
        AND proyecto.nrc = ${nrc}
    ORDER BY proyecto.id_proyecto
    `)
    .then(([result,metadata]) => res.json(result))
    .catch(error => handleError(error))
}

async function getInfoEquipos(req,res){
    const {nrc} = req.params;
    await
    sequelize.query(`
    SELECT alumno.matricula, persona.nombre, persona.paterno, persona.materno,
        equipo.id_proyecto,proyecto.nombre_proyecto
    FROM persona,alumno,equipo,proyecto
    WHERE persona.id_persona = alumno.id_persona 
	    AND alumno.matricula = equipo.matricula
        AND equipo.id_proyecto = proyecto.id_proyecto
        AND proyecto.nrc = ${nrc}
    ORDER BY equipo.id_proyecto`)
    .then(([result,metadata]) => res.json(result))
    .catch(error => handleError(error))
}
async function findProyectos(req,res){
    console.log(req.params.nrc)
    const {nrc} = req.params;
    await 
    sequelize.query(`SELECT materia.nombre, proyecto.nombre_proyecto, 
                            proyecto.id_proyecto, proyecto.descripcion
                    FROM materia, proyecto
                    WHERE materia.nrc = proyecto.nrc
                    AND materia.nrc = ${nrc}`)
    .then(([result,metadata]) => res.json(result))
    .catch(error => handleError(error))
}

module.exports = {
    getMaterias,
    getAlumnosIncritos,
    existsMateria,
    findProyectos,
    getInfoEquipos,
    getEntregables
}