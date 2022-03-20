class ValidationError{
    constructor(field,message){
        this.field = field
        this.messages = [message]
    }

    addMessage(message){
        this.messages.push(message)
    }
}

module.exports = ValidationError