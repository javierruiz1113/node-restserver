//
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es obligatoria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuario'
    },
    estado: {
        type: Boolean,
        default: true
    },
});


module.exports = mongoose.model('Categoria', categoriaSchema);


// let categoriaSchema = new Schema({
//     nombreCategoria: {
//         type: String,
//         required: [true, 'El nombre es requerido']
//     },
//     imgCategoria: {
//         type: String,
//         required: false
//     },
//     estadoCategoria: {
//         type: Boolean,
//         default: true
//     },
// });



// module.exports = mongoose.model('categoria', categoriaSchema);