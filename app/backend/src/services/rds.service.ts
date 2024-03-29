import * as dotenv from 'dotenv';
dotenv.config();
//import AWS from 'aws-sdk'
//prisma
import { PrismaClient } from '@prisma/client'
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
            //console.log(data);
            return true;
        } catch (error) {
            console.log(error);
            return false;
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
            //console.log(data);
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
            //console.log(data);
            return data; //TODO: switch to json return
        }catch (error) {
            console.log(error);
            return error; //TODO: return error code
        }
    }
    public async createFile(username:string,filename:string,s3_url): Promise<number> {
        return -1;
    }
    
}


export default RDSService;