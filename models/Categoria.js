const mongosse = require("mongoose")

const Schema = mongosse.Schema;


const Categoria = new Schema({
    nome:{
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default:Date.now()
    }

})

mongosse.model("categorias", Categoria)