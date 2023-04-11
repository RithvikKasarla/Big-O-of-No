import * as dotenv from 'dotenv';
dotenv.config();
//import AWS from 'aws-sdk'
//prisma
import { PrismaClient } from '@prisma/client'
import { promises } from 'dns';
const prisma = new PrismaClient()



class UserService {
    constructor () {

    }

    //Get users given an array of queries.
    public async getUsers(classId:string): Promise<string[]> {
        console.warn("getUsers() not implemented yet.")
        return [];
    }
    //Get all users
    public async getAllUsers(): Promise<string[]> {
        console.warn("getAllUsers() not implemented yet.")
        return [];
    }
}

export default UserService;