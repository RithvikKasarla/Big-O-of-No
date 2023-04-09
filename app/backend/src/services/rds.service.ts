import * as dotenv from 'dotenv';
dotenv.config();
//import AWS from 'aws-sdk'
//prisma
import { PrismaClient } from '@prisma/client'
import { promises } from 'dns';
const prisma = new PrismaClient()


//Accesses a MySQL Database via AWS RDS. 
//Uses Prisma.
class RDSService {
    private config = {
        region: process.env.AWS_REGION,
    }

    constructor() {
        
    }


    //create user
    //Should return true if successful, false if not
    public async createUser(username: string): Promise<boolean> {
        try {
            const data = await prisma.user.create({
                data: {
                    username: username,
                }
            });
            console.log(data);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    //create file
    //Should return the id if successful, 0 if already exists, -1 if error
    public async createFile(username: string, filename: string, url: string): Promise<number> {
        try {
            //check if already exists by s3_url 
            const file = await prisma.file.findFirst({
                where: {
                    s3_url: url
                }
            });
            if(file){
                console.log(`File already exists!`);
                return 0;
            }

            const data = await prisma.file.create({
                data: {
                    filename: filename,
                    s3_url: url,
                    author: {
                        connect: {
                            username: username
                        }
                    }
                }
            });
            //check if already exists
            
            console.log(data);
            return data.id;
        } catch (error) {
            console.log(error);
            return -1;
        }
    }
    //create class
    public async createClass(classname:string, description:string): Promise<boolean> {
        try {
            const data = await prisma.class.create({
                data: {
                    name: classname,
                    description: description,
                }
            });
            console.log(data);
            return true; //TODO: switch to json return
        } catch (error) {
            console.log(error);
            return false; //TODO: return error code
        }
    }
    //create post
    public async createPost(title:string, author:string, classname:string, content:string): Promise<boolean> {
        try {
            const data = await prisma.post.create({
                data: {
                    title: title,
                    author: {
                        connect: {
                            username: author
                        }
                    },
                    class: {
                        connect: {
                            name: classname
                        }
                    },
                    content: content,
                }
            });
            console.log(data);
            return true; //TODO: switch to json return
        } catch (error) {
            console.log(error);
            return false; //TODO: return error code
        }
    }
}


export default RDSService;