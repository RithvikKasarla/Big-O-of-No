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
    /*

        model User {
        id       Int       @id @default(autoincrement())
        username String    @unique
        comments Comment[] @relation("UserComments")
        files    File[]    @relation("UserFiles")
        classes  Class[]   @relation("ClassMembership")
        dislikes File[]    @relation("FileDislikes")
        likes    File[]    @relation("FileLikes")
        }

        model Class {
        id          Int     @id @default(autoincrement())
        name        String  @unique
        description String?
        files       File[]  @relation("ClassFiles")
        members     User[]  @relation("ClassMembership")
        }

        model File {
        id       Int       @id @default(autoincrement())
        s3_url   String    @unique
        authorId Int
        classId  Int
        rating   Int       @default(0)
        title    String
        comments Comment[] @relation("FileComments")
        author   User      @relation("UserFiles", fields: [authorId], references: [id])
        class    Class     @relation("ClassFiles", fields: [classId], references: [id])
        dislikes User[]    @relation("FileDislikes")
        likes    User[]    @relation("FileLikes")

        @@index([authorId], map: "File_authorId_fkey")
        @@index([classId], map: "File_classId_fkey")
        }

        model Comment {
        id       Int    @id @default(autoincrement())
        content  String
        authorId Int
        fileId   Int
        author   User   @relation("UserComments", fields: [authorId], references: [id])
        file     File   @relation("FileComments", fields: [fileId], references: [id])

        @@index([authorId], map: "Comment_authorId_fkey")
        @@index([fileId], map: "Comment_fileId_fkey")
        }

    */
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
                include: {
                    likes: true,
                    dislikes: true,
                    author: true,
                }
            });
            console.log(`Found ${result.length} files matching classId = ${classId} userId =  ${userId} username = ${username} fileId = ${fileId} title = ${title}`);
            console.log(`Result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            throw error;
        }
    }
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
    async likeFile(
        {fileId, userId}: {fileId: number, userId: number}
        ){
        try {
            const file:File = await prisma.file.findUnique({
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
        try {
            const user:User = await prisma.user.findUnique({
                where:{
                    id: userId
                }
            })
            if(!user){
                throw new Error(`User with id ${userId} does not exist.`);
            }
        }
        catch (error) {
            throw error;
        }
        //Check if the user has disliked the file
        try {
            const dislikedFile = await prisma.file.findUnique({
                where:{
                    id: fileId
                },
                select:{
                    dislikes:{
                        where:{
                            id: userId
                        }
                    }
                }
            });
            if(dislikedFile.dislikes.length > 0){
                //Remove user from the file's dislikes
                try {
                    const dislikedFile = await prisma.file.update({
                        where:{
                            id: fileId
                        },
                        data:{
                            dislikes:{
                                disconnect:{
                                    id: userId
                                }
                            }
                        }
                    });
                } catch (error) {
                    throw error;
                };
            }
        } catch (error) {
            throw error;
        };

        //Add user to a File's likes
        try {
            const likedFile = await prisma.file.update({
                where:{
                    id: fileId
                },
                data:{
                    likes:{
                        connect:{
                            id: userId
                        }
                    }
                },
                include:{
                    likes: true,
                    dislikes: true
                }
            });
            return likedFile;
        } catch (error) {
            throw error;
        };
    }
    async dislikeFile(
        {fileId, userId}: {fileId: number, userId: number}
        ){
        try {
            const file:File = await prisma.file.findUnique({
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
        try {
            const user:User = await prisma.user.findUnique({
                where:{
                    id: userId
                }
            })
            if(!user){
                throw new Error(`User with id ${userId} does not exist.`);
            }
        }
        catch (error) {
            throw error;
        }
        //Check if the user has liked the file
        try {
            const likedFile = await prisma.file.findUnique({
                where:{
                    id: fileId
                },
                select:{
                    likes:{
                        where:{
                            id: userId
                        }
                    }
                }
            });
            if(likedFile.likes.length > 0){
                //Remove user from the file's likes
                try {
                    const likedFile = await prisma.file.update({
                        where:{
                            id: fileId
                        },
                        data:{
                            likes:{
                                disconnect:{
                                    id: userId
                                }
                            }
                        }
                    });
                } catch (error) {
                    throw error;
                };
            }
        }
        catch (error) {
            throw error;
        }
        //Add user to a File's dislikes
        try {
            const dislikedFile = await prisma.file.update({
                where:{
                    id: fileId
                },
                data:{
                    dislikes:{
                        connect:{
                            id: userId
                        }
                    }
                },
                include:{
                    likes: true,
                    dislikes: true
                }
            });
            return dislikedFile;
        }
        catch (error) {
            throw error;
        }
    }
}
export default FileService;