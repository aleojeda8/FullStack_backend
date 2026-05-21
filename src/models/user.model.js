import { number, required, string } from 'joi';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nombre: {
        type: string,
        required: true
    },
    apellido:{
        type: string,
        required: true
    },
    email:{
        type: string,
        required: true,
        unique: true
    },
    password:{
        type: string,
        required: true
    },
    edad:{
        type: number,
        required: true
    },
    sexo:{
        type: string,
        required: true
    },
    telefono:{
        type: string,
        required: true
    },
    direccion:{
        type: string,
        required: true
    }
},{
    timestamps: true
})

const User = mongoose.model('User',userSchema)
export default User