import bcrypt from 'bcryptjs'
import User  from '../models/user.model.js'
import Audit from '../models/audit.model.js'
import mongoose from 'mongoose';
const getUsersService = async() => {
    try{
        console.log('service -> getUsersService')
        const users = await User.find().select('-password')
        return users
    }catch (error){
        throw error
    }
}

const createUserService = async(data) => {
    try{
        console.log('service -> createUserService')
        console.log(data)
        const existUser = await User.findOne({
            email: data.email
        })
        if(existUser){
            throw new Error('Este usuario ya existe')
        }
        const hashedPassword = await bcrypt.hash(
            data.password,
            10
        )
        const user = new User({
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            password: hashedPassword,
            edad: data.edad,
            sexo: data.sexo,
            telefono: data.telefono,
            direccion: data.direccion,
            localidad: data.localidad,
            provincia: data.provincia,
            codigopostal: data.codigopostal,
            pais: data.pais

        })

        await user.save()
        return{
            id: user._id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            edad: user.edad,
            sexo: user.sexo,
            telefono: user.telefono,
            direccion: user.direccion,
            localidad: user.localidad,
            provincia: user.provincia,
            codigopostal: user.codigopostal,
            pais: user.pais
        }
    }
    catch(error){
        throw error
    }
}

const updateUserService = async(id,data) => {
    try{
        console.log('service -> updateUserService')
        console.log(id)
        console.log(data)
        if(!mongoose.Types.ObjectId.isValid(id)){
            throw new Error('Usuario no encontrado')
        }
        const user = await User.findById(id)

        if(data.email){
            throw new Error('El email no puede modificarse')
        }

        if(data.nombre) user.nombre = data.nombre
        if(data.apellido) user.apellido = data.apellido
        if(data.edad) user.edad = data.edad
        if(data.sexo) user.sexo = data.sexo
        if(data.telefono) user.telefono = data.telefono
        if(data.direccion) user.direccion = data.direccion
        if(data.localidad) user.localidad = data.localidad
        if(data.provincia) user.provincia = data.provincia
        if(data.codigopostal) user.codigopostal = data.codigopostal
        if(data.pais) user.pais = data.pais
        
        /// cambiar password si viene
        if(data.password){
            user.password = await bcrypt.hash(
                data.password,10
            )
        }

        await user.save()

        return{
            id: user._id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            edad: user.edad,
            sexo: user.sexo,
            telefono: user.telefono,
            direccion: user.direccion,
            localidad: user.localidad,
            provincia: user.provincia,
            codigopostal: user.codigopostal,
            pais: user.pais
        }
    }catch(error){
        throw error
    }
} 

const deleterUserService = async(id) => {
    try{
        console.log('service -> deleterUserService')
        console.log(id)
        const user = await User.findById(id)
        if(!user){
            throw new Error('Usuario no encontrado')
        }
        await Audit.create({
            usuarioEliminado: user
        })
        await User.findByIdAndDelete(id)
        return{
            message:"Usuario eliminado"
        }
    }catch(error){
        throw error
    }
} 

export{
    getUsersService,
    createUserService,
    updateUserService,
    deleterUserService
}