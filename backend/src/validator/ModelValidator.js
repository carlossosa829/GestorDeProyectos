const ValidationError = require('./ValidationError')

class ModelValidator{
    constructor(){
        this.errors = []
    }

    getErrors(){
        return (this.errors.length > 0 ? this.errors : null)
    }

    addError(field,message){
        let errorOnList = this.errors.find(error => error.field === field)

        if(errorOnList)
            errorOnList.addMessage(message)
        else
            this.errors.push(new ValidationError(field,message))
    }

    extractValidationErrors({errors}){
        errors.forEach(error => this.addError(error.path,error.message))
    }
    
    async validate(model,{skip}){
        try{
            await model.validate({skip})
        }
        catch(err){
            this.extractValidationErrors(err)
        }
    }
}

module.exports = ModelValidator