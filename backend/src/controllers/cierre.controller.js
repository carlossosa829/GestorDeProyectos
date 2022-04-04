const {sequelize} = require('../config/sequelize')
const {handleError} = require('./error.controller')
async function getCierre(req,res){
    const {id_proyecto} = req.params
    await sequelize.query(`
    SELECT * FROM cierre WHERE cierre.id_proyecto=${id_proyecto}
    `)
    .then(([cierre,metadata]) =>{
        res.json(cierre)
    })
    .catch(error=>handleError(error))
}

module.exports={
    getCierre
}