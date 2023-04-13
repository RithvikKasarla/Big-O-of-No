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
    //Gets a list of classes given a list of queries
    public async getClasses(
        {classId = -1, userId = -1, username = ''}:
        {classId?: number,userId?: number,username?: string}
    ): Promise<Class[]> {
        const result = await prisma.class.findMany({
            where: {
                ...((classId == -1) ? {} : {id: classId}),
                ...((username == '') ? {} : {
                    members: {
                        some: {
                            username: username
                        }
                    }
                }),
                ...(userId == -1) ? {} : {
                    users: {
                        some: {
                            id: userId
                        }
                    }
                },
            }
        });
        return result;
    }
    //Creates a class given a name and (optionally) a description
    public async createClass(
        {name, description = ''}:
        {name: string, description?: string}
    ): Promise<Class> {
        if (!name) {
            throw new Error('A valid name is required.');
        }
        try {
            const result = await prisma.class.create({
                data: {
                    name: name,
                    description: description,
                }
            });

        return result;
        } catch (error) {
            throw new Error(error);
        }

    }
    //Deletes a class given a classId
    public async deleteClass(
        {classId}:
        {classId: number}): Promise<boolean> {
        try {
            const result = await prisma.class.delete({
                where: {
                    id: classId
                }
            });
            return true;
        } catch (error) {
            throw new Error(error);
        }
    }
    //Adds a user to a class
    public async joinClass(
        {classId,userId}:
        {classId: number, userId: number}): Promise<boolean> {
        try {
            const result = await prisma.class.update({
                where: {
                    id: classId
                },
                data: {
                    members: {
                        connect: {
                            id: userId
                        }
                    }
                }
            });
            return true;
        } catch (error) {
            throw new Error(error);
        }
            
    }
    //Removes a user from a class
    public async leaveClass(
        {classId,userId}:
        {classId: number, userId: number}): Promise<boolean> {
        try {
            const result = await prisma.class.update({
                where: {
                    id: classId
                },
                data: {
                    members: {
                        disconnect: {
                            id: userId
                        }
                    }
                }
            });
            return true;
        } catch (error) {
            throw new Error(error);
        }
    }
}
export default ClassService;