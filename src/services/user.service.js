const getUsersService = async() => {
    try{
        console.log('service -> getUsersService')
        return[]
    }catch (error){
        throw error
    }
}

const createUserService = async(data) => {
    try{
        console.log('service -> createUserService')
        console.log(data)
        return data
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