import * as dotenv from 'dotenv';
dotenv.config();
//import AWS from 'aws-sdk'
//prisma
import { User,File, PrismaClient } from '@prisma/client'
import { promises } from 'dns';
const prisma = new PrismaClient()

class FileService {
    constructor () {

    }

    //Get a list of files given a list of queries.
    //Returns a list of file objects.
    //Supports query parameters {classId, userId, username, fileId, title}
    async getFiles(
        {classId = -1, userId = -1, username = '', fileId = -1, title = ''}:
        {classId?: number, userId?: number, username?: string, fileId?: number, title?: string}
    ): Promise<File[]>{
        try {
            const result:File[] = await prisma.file.findMany({
                where: {
                    ...((classId == -1) ? {} : {classId: classId}),
                    ...((userId == -1) ? {} : {authorId: userId}),
                    ...((username == '') ? {} : {
                        author: {
                            username: username
                        }
                    }),
                    ...((fileId == -1) ? {} : {id: fileId}),
                    ...((title == '') ? {} : {title: title}),
                },
            });
            console.log(`Found ${result.length} files matching classId = ${classId} userId =  ${userId} username = ${username} fileId = ${fileId} title = ${title}`);
            console.log(`Result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            throw error;
        }
    }
    /*
    model File {
    id       Int    @id @default(autoincrement())
    title    String
    s3_url   String @unique
    rating   Int    @default(0)
    authorId Int
    author   User   @relation("UserFiles", fields: [authorId], references: [id])
    classId  Int
    class    Class  @relation("ClassFiles", fields: [classId], references: [id])
    //comments
    comments Comment[] @relation("FileComments")
    }
    */
    //Create a file in the database.
    //Returns the file object.
    async createFile(
        {title,s3_url,authorId,classId}:
        {title:string, s3_url: string, authorId: number, classId: number }): Promise<File> {
        //If the s3_url is not unique, throw an error.
        try {
            const file = await prisma.file.findUnique({
                where:{
                    s3_url: s3_url
                }
            })
            if(file){
                throw new Error(`S3_URL ${s3_url} is already used, cannot create S3 instance.`);
            }
        } catch (error) {
            throw error;
        }
        
        const createdFile = await prisma.file.create({
            data: {
                title: title,
                s3_url: s3_url,
                author:{
                    connect:{
                        id: authorId
                    }
                },
                class:{
                    connect:{
                        id: classId
                    }
                }
            }
        })
        return createdFile;
    }

    async deleteFile(
        {fileId}: {fileId: number}
    ): Promise<File>{
        try {
            const file = await prisma.file.findUnique({
                where:{
                    id: fileId
                }
            })
            if(!file){
                throw new Error(`File with id ${fileId} does not exist.`);
            }
        } catch (error) {
            throw error;
        }
        const deletedFile = await prisma.file.delete({
            where:{
                id: fileId
            }
        })
        return deletedFile;
    }
}
export default FileService;