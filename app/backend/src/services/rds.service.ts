import * as dotenv from 'dotenv';
dotenv.config();
//import AWS from 'aws-sdk'
//prisma
import { Post, PrismaClient } from '@prisma/client'
import { promises } from 'dns';
const prisma = new PrismaClient()


//Accesses a MySQL Database via AWS RDS. 
//Uses Prisma.
//TODO: Split RDS Service into multiple services, for User Auth, File, Class, Post, etc.
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
    //get ALL classes
    public async getAllClasses(): Promise<any> {
        try {
            const data = await prisma.class.findMany({});
            console.log(data);
            return data; //TODO: switch to json return
        }catch (error) {
            console.log(error);
            return error; //TODO: return error code
        }
    }
    public async classExists(classId:number): Promise<boolean> {
        try {
            const data = await prisma.class.findFirst({
                where: {
                    id: classId
                }
            });
            console.log(data);
            if(data){
                return true;
            }
            return false; //TODO: switch to json return 
        }catch (error) {
            console.log(error);
            return false; //TODO: return error code
        }

    }
    //get classes from user
    //should include Class Ids
    public async getUserClasses(username:string): Promise<any> {
        try {
            const data = await prisma.class.findMany({
                where: {
                    members: {
                        some: {
                            username: username
                        }
                    }
                }
            });
            console.log(data);
            return data; //TODO: switch to json return
        }catch (error) {
            console.log(error);
            return error; //TODO: return error code
        }
    }
    //add user to class
    public async addUserToClass(username:string, classId:number): Promise<boolean> {
        try {
            const data = await prisma.class.update({
                where: {
                    id: classId
                },
                data: {
                    members: {
                        connect: {
                            username: username
                        }
                    }
                }
            });
            console.log(data);
            return true; //TODO: switch to json return
        }catch (error) {
            console.log(error);
            return false; //TODO: return error code
        }
    }
    //determine if user is part of a class
    public async isMember(username:string, classId:number): Promise<boolean> {
        try {
            const data = await prisma.class.findFirst({
                where: {
                    id: classId,
                    members: {
                        some: {
                            username: username
                        }
                    }
                }
            });
            console.log(data);
            if(data){
                return true;
            }else{
                return false;
            }
        }catch (error) {
            console.log(error);
            return false; //TODO: return error code
        }
    }
    //create post
    public async createPost(title:string, author:string, classId:number, content:string): Promise<boolean> {
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
                            id: classId
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
    //get posts from class
    public async getClassPosts(classname:string): Promise<Array<Post>> {
        try {
            const data = await prisma.post.findMany({
                where: {
                    class: {
                        name: classname
                    }
                }
            });
            console.log(data);
            return data; //TODO: switch to json return
        }catch (error) {
            console.log(error);
            return []; //TODO: return error code
        }
    }
    
}


export default RDSService;