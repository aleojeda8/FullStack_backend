import bcrypt from 'bcryptjs'
import User  from '../models/user.model.js'
import Audit from '../models/audit.model.js'
import mongoose from 'mongoose';

const getUsersService = async({ id, email, requesterRole, requesterId}) => {
    console.log('service -> getUsersService')
    try{
        const role = requesterRole?.toUpperCase();
        const currentUserId = requesterId?.toString();

        if (!role) {
            throw {
                statusCode: 403,
                message: "No tienes permisos para ver usuarios",
            };
        }

        // Buscar por ID
        if (id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw {
                statusCode: 400,
                message: "Id inválido",
            };
        }

        if (role === " GUEST" && id !== currentUserId) {
            throw {
                statusCode: 403,
                message: "No tienes permisos para ver este usuario",
            };
        }

        const user = await User.findById(id).select("-password");
        if (!user) {
            throw {
                statusCode: 404,
                message: "Usuario no encontrado",
            };
        }

        if (role === "ADMIN" && user.role === "ROOT") {
            throw {
                statusCode: 403,
                message: "No tienes permisos para ver usuarios root",
            };
        }

            return user;
        }

        // Buscar por email
        if (email) {
            const user = await User.findOne({
                email,
        }).select("-password");
        if (!user) {
            throw {
                statusCode: 404,
                message: "Usuario no encontrado",
            };
        }

        if (role === "USER" && user._id.toString() !== currentUserId) {
            throw {
                statusCode: 403,
                message: "No tienes permisos para ver este usuario",
            };
        }

        if (role === "ADMIN" && user.role === "ROOT") {
            throw {
                statusCode: 403,
                message: "No tienes permisos para ver usuarios root",
            };
        }

            return user;
        }

        // if (role === "USER") {
        //     const user = await User.findById(currentUserId).select("-password");
        //     if (!user) {
        //         throw {
        //             statusCode: 404,
        //             message: "Usuario no encontrado",
        //         };
        //     }
        //     return [user];
        // }
        if (role === "GUEST") {
            const user = await User.findById(currentUserId).select("-password");
            if (!user) {
                throw {
                    statusCode: 404,
                    message: "Usuario no encontrado",
                };
            }
            return [user];
        }
        // Obtener todos

        if (role === "ADMIN") {
            return await User.find({ role: { $ne: "ROOT" } })
            .select("-password")
            .sort({ nombre: 1 });
        }
        if (role === "USER") {
            return await User.find({ role: {  $in: ["USER", "GUEST"] } })
            .select("-password")
            .sort({ nombre: 1 });
        }

        return await User.find().select("-password").sort({nombre:1});
    }catch(error){
        throw{
            statusCode: error.statusCode || 500,
            message: error.message || "Error interno del servidor",
            errors: error.errors || null,
        };
    };
}

const createUserService = async(data) => {
    console.log('service -> createUserService')
    try{
        const existUser = await User.findOne({
            email: data.email
        })
        if(existUser){
            throw {
                statusCode: 409,
                message: "El usuario ya existe",
            };
        }
        const hashedPassword = await bcrypt.hash(
            data.password,
            10,
        );
        const user = new User({
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            password: hashedPassword,
            fechaNacimiento: data.fechaNacimiento,
            edad: data.edad,
            genero: data.genero,
            telefono: data.telefono,
            direccion: data.direccion,
            localidad: data.localidad,
            provincia: data.provincia,
            cp: data.cp,
            pais: data.pais,
            role: data.role,
        });

        await user.save()
        return{
            id: user._id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            fechaNacimiento: user.fechaNacimiento,
            edad: user.edad,
            genero: user.genero,
            telefono: user.telefono,
            direccion: user.direccion,
            localidad: user.localidad,
            provincia: user.provincia,
            cp: user.cp,
            pais: user.pais,
            role: user.role,
        };
    }
    catch(error){
        console.error(
            "Error en createUserService:",error
        );

        throw{
            statusCode: error.statusCode || 500,
            message: error.message || "Error interno del serviidor",
            errors: error.errors || null,
        };
    }
};

const updateUserService = async(id,data) => {
    console.log('service -> updateUserService')
    try{
        if(!mongoose.Types.ObjectId.isValid(id)){
            throw{
                statusCode: 400,
                message: "Id invalido",
            };
        }
        const user = await User.findById(id)

        if(!user){
            throw{
                statusCode: 404,
                message: "Usuario no encontrado",
            };
        }

        if(data.email !== undefined){
            throw{
                statusCode: 400,
                message: "El email no puede modificarse",
            };
        }

        const allowedFields = ["nombre", "apellido","fechaNacimiento","edad","genero","telefono",
            "direccion","localidad","provincia","cp", "pais","role",];

        allowedFields.forEach((field) => {
            if(data[field] !== undefined){
                user[field] = data[field];
            }
        });

        /// cambiar password si viene
        if(data.password !== undefined){
            user.password = await bcrypt.hash(
                data.password,10
            );
        }

        await user.save()

        return{
            id: user._id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            fechaNacimiento: user.fechaNacimiento,
            edad: user.edad,
            genero: user.genero,
            telefono: user.telefono,
            direccion: user.direccion,
            localidad: user.localidad,
            provincia: user.provincia,
            cp: user.cp,
            pais: user.pais,
            role: user.role
        };
    }catch(error){
        console.error(
            "Error en updateUserServices:",
            error
        );
        throw{
            statusCode: error.statusCode || 500,
            message: error.message || "Error interno del servidor",
            errors: error.errors || null,
        };
    }
} ;

const deleteUserService = async(id) => {
    console.log('service -> deleteUserService')
    let session;
    try{
        if(!mongoose.Types.ObjectId.isValid(id)){
            throw{
                statusCode: 400,
                message: "Id invalido",
            };
        }
        session = await mongoose.startSession();
        await session.withTransaction(async() => {
            const user = await User.findById(id).session(session);
            if(!user){
            throw{
                statusCode: 400,
                message: "Usuario no encontrado",
                };
            }
            await Audit.create([{
                usuarioEliminado: user.toObject(),
                fechaEliminacion: new Date()
            },],{session});
            await user.deleteOne({session});
        })
        return{
            message:"Usuario eliminado"
        };
    }catch(error){
        console.error(
            "Error en deleteUserService:",
            error
        );
        throw{
            statusCode: error.statusCode || 500,
            message: error.message || "Error interno del servidor",
            errors: error.errors || null,
        };
    }finally{
        if(session){
            await session.endSession();
        }
    }
};

export{getUsersService,createUserService,updateUserService,deleteUserService};