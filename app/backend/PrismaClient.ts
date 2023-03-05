const PrismaClient = require('@prisma/client').PrismaClient
const prisma = new PrismaClient()

//Confirmed working.
//Pushes the user object to the database.
//returns the new user object
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
//Gets the users of the database.
//returns a list of user objects.
module.exports.getUsers = async function(){
    console.log('Getting users...')
    const users = await prisma.user.findMany()
    console.log(users)
    return users
}

