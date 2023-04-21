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
    async getComment(
        {commentId}:{commentId: number}
    ):Promise<Comment>{
        try {
            const comment = await prisma.comment.findUnique({
                where: {
                    id: commentId
                }
            });
            return comment;
        } catch (error) {
            throw error;
        }
    }
    async createComment(
        {fileId, userId, content}:{fileId: number, userId: number, content: string}
    ):Promise<Comment>{
        try {
            //Create the comment.
            //connect the comment to the file and user.
            const comment = await prisma.comment.create({
                data: {
                    content: content,
                    author: {
                        connect: {
                            id: userId
                        }
                    },
                    file: {
                        connect: {
                            id: fileId
                        }
                    }
                }
            });
            return comment;
        } catch (error) {
            throw error;
        }
    }
    async deleteComment(
        {commentId}:{commentId: number}
        ):Promise<Comment>{
        try {
            //Delete the comment.
            const comment = await prisma.comment.delete({
                where: {
                    id: commentId
                }
            });
            return comment;
        } catch (error) {
            throw error;
        }
    }
}
export default CommentService;