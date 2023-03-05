const PrismaClient = require('@prisma/client').PrismaClient
const prisma = new PrismaClient()

//Confirmed working.
module.exports.createUser = async function(name, email){
    console.log('Creating user...')
    // run inside `async` function
    const newUser = await prisma.user.create({
        data: {
            name: name,
            email: email,
        },
    })
    return newUser
}
//Confirmed working.
module.exports.getUsers = async function(){
    console.log('Getting users...')
    const users = await prisma.user.findMany()
    console.log(users)
    return users
}
