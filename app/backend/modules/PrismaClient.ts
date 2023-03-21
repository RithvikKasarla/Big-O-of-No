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
    //catch errors
    return newUser
}
//Confirmed working.
//Gets the users of the database.
//returns a list of user objects.
module.exports.getUsers = async function(){
    console.log('Getting users...')
    const users = await prisma.user.findMany()
    console.log(users)
    //catch errors.
    return users
}
//Create post.
module.exports.createPost = async function(title, body, author_id, class_id){
    console.log('Creating post...')
    const newPost = await prisma.post.create({
        data: {
            title: title,
            body: body,
            author: {
                connect: {
                    id: author_id
                }
            },
            class: {
                connect: {
                    id: class_id
                }
            },
            date: new Date(),
        }
    })
}






//Creates a new File object in the database.
//returns the new file object.
/*
  id        Int     @id @default(autoincrement())
  name      String //Name of the file.
  author    User    @relation(fields: [authorId], references: [id]) //Link to the user who uploaded the file.
  authorId  Int //Link to the user who uploaded the file.
  path      String  @unique //Unique path to the file (assumedly in a s3 bucket)
  posts     Post[] //Many to many relationship with posts.
*/
//***TODO Make not reliant on posts existing.
module.exports.createFile = async function(file_name, author_id, path, post_ids){
    console.log('Creating file...')
    const newFile = await prisma.file.create({
        data: {
            name: file_name,
            author: {
                connect: {
                    id: author_id
                }
            },
            path: path,
            posts: {

            },
        }
    })
    //catch errors
    return newFile
}