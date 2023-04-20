import * as dotenv from 'dotenv';
dotenv.config();
//import AWS from 'aws-sdk'
//prisma
import { User,Comment, PrismaClient } from '@prisma/client'
import { promises } from 'dns';
const prisma = new PrismaClient()
/*
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
class CommentService {
    constructor () {

    }
    async getComments(
        {fileId, userId,classId, commentId}:{fileId?: number, userId?: number, classId?: number,  commentId?: number}
    ):Promise<Comment[]>{
        try {
            //Get the comments matching the query.
            const comments = await prisma.comment.findMany({
                where: {
                    ...((fileId == -1) ? {} : {fileId: fileId}),
                    ...((userId == -1) ? {} : {authorId: userId}),
                    ...((classId == -1) ? {} : {file: {classId: classId}}),
                    ...((commentId == -1) ? {} : {id: commentId})
                }
            });
            return comments;
        } catch (error) {
            throw error;
        }
    }
    async createComment(
        {}:{}
    ){
        try {
            
        } catch (error) {
            throw error;
        }
    }
    async deleteComment(){}
    
}
export default CommentService;