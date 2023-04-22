import App from "./app";
import bodyParser from "body-parser";

//auth controller
import AuthController from "./controllers/auth.controller";
//class controller
import ClassController from "./controllers/class.controller";
//comment controller
import CommentController from "./controllers/comment.controller";
//file controller
import FileController from "./controllers/file.controller";
//user controller
import UserController from "./controllers/user.controller";
//import .env
import dotenv from "dotenv";
dotenv.config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const wait = (time) => new Promise(resolve => setTimeout(resolve, time || 0));
const retry = (cont, fn, delay) => fn().catch(err => cont > 0 ? wait(delay).then(() => retry(cont - 1, fn, delay)) : Promise.reject('failed'));
try {
    console.log('printing env variables');
    console.log(`AWS_REGION: ${process.env.AWS_REGION}`);
    console.log(`S3_BUCKET_NAME: ${process.env.S3_BUCKET_NAME}`);
    //wait 5 seconds
    //Test network by fetching google.com
    console.log(`fetch ${fetch}`)
    //until google.com is fetched, keep trying
    retry(5, () => fetch('https://google.com'), 5000).then(() => {
        console.log('connected to internet');
        //connect to server
        connect();
    });
} catch (error) {
    console.log(error);
}

function connect(){
    const app = new App({
        port: 3001,
        controllers: [
            new AuthController(),
            new ClassController(),
            new CommentController(),
            new FileController(),
            new UserController(),
            
        ],
        middlewares: [
            bodyParser.json(),
            bodyParser.urlencoded({ extended: true }),
        ],
    });
    app.listen();
}