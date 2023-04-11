import * as dotenv from 'dotenv';
dotenv.config();
//import AWS from 'aws-sdk'
//prisma
import { User, PrismaClient } from '@prisma/client'
import { promises } from 'dns';
const prisma = new PrismaClient()



class UserService {
    
    constructor () {
        
    }
    
    //Get users given an array of queries.
    public async getUsers(classId:number, userId:number, username:string): Promise<User[]> {
        
        //const classname = (classId == -1) ? "*" : (await prisma.class.findUnique({ where:{ id:classId}})).name;
        //['name']
        //const userId = (userId == -1) ? "*" : (await prisma.user.findUnique({ where:{ id:userId}})).username;


        const result = await prisma.user.findMany({
            where: {
                ...((classId == -1) ? {} : {
                    classes: {
                        some: {
                            name: await (async () => {
                                const classResult = await prisma.class.findUnique({ where:{ id:classId}});
                                return classResult?.name || '';
                            })()
                        }
                    }
                }),
                ...((userId == -1) ? {} : {id: userId}),
                ...((username == '') ? {} : {username: username}),
            }
        });
        console.log(result);
        return result;
    }
    //Get User from a userId
}

export default UserService;