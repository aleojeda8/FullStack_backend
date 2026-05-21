import bcrypt from 'bcryptjs'
import User  from '../models/user.model.js'
import Audit from '../models/audit.model.js'
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
            email: data.emaill,
            password: hashedPassword,
            edad: data.edad,
            sexo: data.sexo,
            telefono: data.telefono,
            direccion: data.direccion

        })

        await user.save()
        return{
            id: user._id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.emaill,
            edad: user.edad,
            sexo: user.sexo,
            telefono: user.telefono,
            direccion: user.direccion
        }
    }catch(eroor){
        throw error
    }
}

const updateUserService = async(id,data) => {
    try{
        console.log('service -> updateUserService')
        console.log(id)
        console.log(data)
        return{
            id,
            ...data
        }
    }catch(error){
        throw error
    }
} 

const deleterUserService = async(id) => {
    try{
        console.log('service -> deleterUserService')
        console.log(id)
        return{
            message:"Usuaro eliminado"
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