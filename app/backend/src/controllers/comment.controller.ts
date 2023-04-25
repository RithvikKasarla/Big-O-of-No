import express, { Request, Response} from 'express';
import AuthMiddleware from '../middleware/auth.middleware';
import { User, Comment } from '@prisma/client';
import { body,param, query, validationResult } from 'express-validator';

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
import UserService from '../services/user.service';
import ClassService from '../services/class.service';
import CommentService from '../services/comment.service';
//These resources are only accessible via Cognito sign in.
class CommentController {
    public path = '';
    public router = express.Router();
    private authMiddleware: AuthMiddleware;

    constructor() {
        this.authMiddleware = new AuthMiddleware();
        this.initializeTokenRoutes();
        this.initializeAdminRoutes();
    }

    public async initializeTokenRoutes() {
        const tokenMiddleware = this.authMiddleware.verifyToken;
        //this.router.use(this.authMiddleware.verifyToken); //All functions after this require a token.
        // Put a comment
        // PUT URL/class/:classId/file/:fileId/
        this.router.put(`/file/:fileId/comment`,await this.validateBody('createComment'), tokenMiddleware, this.createComment);
        // Get Comments
        // POST URL/class/:classId/file/:fileId/
        this.router.post(`/file/:fileId/comment`,await this.validateBody('getComments'), tokenMiddleware, this.getComments);
        // Delete a comment
        // DELETE URL/class/:classId/file/:fileId/comment/:commentId
        this.router.delete(`/comment/:commentId`,await this.validateBody('deleteComment'), tokenMiddleware, this.deleteComment);
        
    }
    public async initializeAdminRoutes() {
        const adminMiddleware = this.authMiddleware.verifyAdmin;
        //this.router.use(this.authMiddleware.verifyAdmin) //All functions after this require admin.
        // Get all comments
        // POST URL/comment/all
        //Supported Queries: ?userId, ?classId, ?fileId, ?commentId
        this.router.post(`/comment/all`,await this.validateBody('getAllComments'), adminMiddleware, this.getAllComments);
        // Force delete a comment
        // DELETE URL/comment/:commentId
        this.router.delete(`/comment/all/:commentId`,await this.validateBody('forceDeleteComment'), adminMiddleware, this.forceDeleteComment);
    }
    //Given the query parameters, return a list of comments.
    //Token is required.
    //Scoped to class.
    //Suported Query Parameters: ?userId, ?classId, ?commentId
    getComments = async (request: Request, response: Response) => {
        const {fileId } = request.params;
        const {userId, classId, commentId} = request.query;
        const { token } = request.body;
        //Get userid from User Service.
        //const userService = new UserService();
        //const user:User = await userService.getUser({token: token});
        
        let getCommentsParams = {
            fileId: parseInt(fileId.toString()), //Required.
            ...(userId) ? {userId: parseInt(userId.toString())} : {},
            ...(classId) ? {classId: parseInt(classId.toString())}: {},
            ...(commentId) ? {commentId: parseInt(commentId.toString())}: {},
        }

        try {
            const commentService = new CommentService();
            const comments: Comment[] = await commentService.getComments(getCommentsParams);
            return response.status(200).send(comments);
        } catch (error) {
            return response.status(500).send(error.message);
        }
    }

    //Get ALL comments.
    //Admin only.
    getAllComments = async (request: Request, response: Response) => {}

    //Create a new comment.
    //Token is required.
    //Scoped to class.
    createComment = async (request: Request, response: Response) => {
        //return response.status(501).send("Not Implemented");
        const {fileId } = request.params;
        const {content} = request.body;
        const { token } = request.body;
        //Get userid from User Service.
        const userService = new UserService();
        const user:User = await userService.getUser({token: token});
        
        let createCommentParams = {
            fileId: parseInt(fileId.toString()), //Required.
            content: content.toString(), //Required.
            userId: user.id, //Required.
        }

        try {
            const commentService = new CommentService();
            const comment: Comment = await commentService.createComment(createCommentParams);
            return response.status(200).send(comment);
        } catch (error) {
            return response.status(500).send(error.message);
        }
    }

    //edit a comment.
    //Token is required.
    //Scoped to comment owner.
    editComment = async (request: Request, response: Response) => {

    }

    //delete a comment.
    //Token is required.
    //Scoped to comment owner.
    deleteComment = async (request: Request, response: Response) => {
        const {commentId } = request.params;
        const { token } = request.body;
        //Get userid from User Service.
        try {
            const userService = new UserService();
            const user:User = await userService.getUser({token: token});
            const commentService = new CommentService();
            const comment: Comment = await commentService.getComment({commentId: parseInt(commentId.toString())});
            //Check if user is comment owner.
            if (user.id !== comment.authorId) {
                return response.status(401).send("Unauthorized");
            }
        } catch (error) {
            return response.status(500).send(error.message);
        }
        //Get comment from Comment Service.
        
        //Delete comment.
        try {
            const commentService = new CommentService();
            const comment: Comment = await commentService.deleteComment({commentId: parseInt(commentId.toString())});
            return response.status(200).send(comment);
        }
        catch (error) {
            return response.status(500).send(error.message);
        }

    }

    //force delete a comment.
    //Admin only.
    forceDeleteComment = async (request: Request, response: Response) => {
        const {commentId } = request.params;
        //Delete comment.
        try {
            const commentService = new CommentService();
            const comment: Comment = await commentService.deleteComment({commentId: parseInt(commentId.toString())});
            return response.status(200).send(comment);
        }
        catch (error) {
            return response.status(500).send(error.message);
        }
        return response.status(501).send("Not Implemented");
    }

    //Verify Body
    private async validateBody(type: string) {
        switch(type) {
            case 'createComment':
                return [
                    param('fileId').isInt({min: 1}),
                    body('content').isString().notEmpty(),
                ]
            case 'getComments':
                return [
                    param('fileId').isInt({min: 1}),
                    query('userId').isInt({min: 1}),
                    query('classId').isInt({min: 1}),
                    query('commentId').isInt({min: 1}),
                ]
            case 'deleteComment':
                return [
                    param('commentId').isInt({min: 1}),
                ]
            case 'getAllComments':
                return [

                ]
            case 'forceDeleteComment':
                return [
                    param('commentId').isInt({min: 1}),
                ]
        }
    }
}
export default CommentController;