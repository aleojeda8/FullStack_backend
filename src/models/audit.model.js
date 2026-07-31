///import { date, object, required } from 'joi'
import mongoose from 'mongoose'
const auditSchema = new mongoose.Schema({
    usuarioEliminado:{
        type: Object,
        required: true
    },
    eliminadoPor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rolDelEliminador:{
        type: String,
        required: true
    },
    fechaEliminacion:{
        type: Date,
        default: Date.now
    }
})

const Audit = mongoose.model('Audit',auditSchema)
export default Audit