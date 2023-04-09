import * as dotenv from 'dotenv';
dotenv.config();
//import AWS from 'aws-sdk'
//prisma
import { PrismaClient } from '@prisma/client'
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
    //Should return true if successful, false if not
    public async createFile(username: string, filename: string, s3_url: string): Promise<boolean> {
        try {
            const data = await prisma.file.create({
                data: {
                    filename: filename,
                    s3_url: s3_url,
                    user: {
                        connect: {
                            username: username
                        }
                    }
                }
            });
            console.log(data);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}


export default RDSService;