import * as dotenv from 'dotenv';
dotenv.config();
//import AWS from 'aws-sdk'
//prisma
import { User, PrismaClient } from '@prisma/client'
import { promises } from 'dns';
const prisma = new PrismaClient()

//Cognito service
import CognitoService from './auth.service';

class UserService {
    
    constructor () {
        
    }
    
    //Get users given an array of queries.
    //classId:number, userId:number, username:string
    //Basically creates 2^3 overloads
    public async getUsers({ 
        classId = -1,
        userId = -1,
        username = '',
        token = ''
    }:{
        classId?: number,
        userId?: number,
        username?: string,
        token?: string
    }): Promise<User[]> {

        let searchQuery = {
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
            ...((username == '') ? ((token == '') ?  {} : {username: await (new CognitoService()).getUsername(token)}) : {username: username}),
        }
        console.log(`Search Query: ${JSON.stringify(searchQuery)}`);
        const result: User[] = await prisma.user.findMany({
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
        console.log(`user.service.ts: getUsers() results: ${result}`)
        return result;
    }
    //Get User Object from parameters (username, userId)
    public async getUser({
        username = '',
        userId = -1,
        token = ''
    }:{
        username?: string,
        userId?: number,
        token?: string
    }): Promise<User> {
        try {
            //console.log(username, userId, token);
            let searchQuery = {
                ...((username == '') ? ((token == '') ? {} : {username: await (new CognitoService()).getUsername(token)}) : {username: username}),
                ...((userId == -1) ? {} : {id: userId}),
            }
            console.log(`searchQuery: ${JSON.stringify(searchQuery)}`)
            const results: User[] = await this.getUsers(searchQuery)
            const result: User = results[0];
            console.log(`user.service.ts: getUser() results: ${results}`)
            return result;
        } catch (error) {
            console.log(`user.service.ts: getUser() error: ${error}`);
            return error;
        }
    }
}

export default UserService;