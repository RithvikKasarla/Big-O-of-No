import * as dotenv from 'dotenv';
dotenv.config();
//import AWS from 'aws-sdk'
//prisma
import { Class, PrismaClient } from '@prisma/client'
import { promises } from 'dns';
const prisma = new PrismaClient()

class ClassService {
    constructor () {

    }
    public async getClasses(classId:number): Promise<Class[]> {
        const result = await prisma.class.findMany({
            where: {
                ...((classId == -1) ? {} : {id: classId}),
            }
        });
        return result;
    }
}
export default ClassService;