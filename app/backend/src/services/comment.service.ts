import * as dotenv from 'dotenv';
dotenv.config();
//import AWS from 'aws-sdk'
//prisma
import { User, PrismaClient } from '@prisma/client'
import { promises } from 'dns';
const prisma = new PrismaClient()

class CommentService {
    constructor () {

    }
    async getComments(){}
    async createComment(){}
    async deleteComment(){}
    
}
export default CommentService;