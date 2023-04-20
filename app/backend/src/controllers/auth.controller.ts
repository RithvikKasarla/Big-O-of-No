import * as express from 'express';
import { Request, Response} from 'express';
import { body, validationResult } from 'express-validator';


import CognitoService from '../services/auth.service';
import RDSService from '../services/rds.service';
//Publically accessible.
//"Doorway" to getting COGNITO access.
class AuthController {
    public path = '/auth';
    public router = express.Router();

    constructor() {
        this.initRoutes();
    }
    //init routes for this controller.
    //uses express-validator to validate the body.
    public initRoutes() {
        //signup / registering a new user.
        this.router.post(`/signup`, this.validateBody('signup'), this.signUp);
        //signing in a user.
        this.router.post(`/signin`, this.validateBody('signin'), this.signIn);
        //verifying a user.
        this.router.post(`/verify`, this.validateBody('verify'), this.verify);
    }

    //Create a new user.
    signUp = async (req: Request, res: Response)  => {

        const result = validationResult(req);
        console.log(req.body)
        if(!result.isEmpty()){
            return res.status(422).json({message: "Failed, likely invalid input.",errors: result.array()})
        }
        //extract the body.
        const {username, password, email, birthday, name, family_name} = req.body;
        const userAttr = [];
        userAttr.push({Name: 'name', Value: name});
        userAttr.push({Name: 'family_name', Value: family_name});
        userAttr.push({Name: 'email', Value: email});
        userAttr.push({Name: 'birthdate', Value: birthday});
        //Cognito
        const cognito = new CognitoService();
        //TODO: Catch User already exists.
        let cognito_success = await cognito.signUp(username, password, userAttr);
        if(!cognito_success){
            return res.status(500).json({message: 'Error with Cognito service.'}).end();
        }
        return res.status(200).json({message: 'Success'}).end();
    }
    
    //Sign in a user, returns access token.
    signIn = async (req: Request, res: Response) => {
        const result = validationResult(req);
        console.log(req.body)
        if(!result.isEmpty()){
            return res.status(422).json({message:"Failed, likely invalid input.",errors: result.array()})
        }
        const {username, password} = req.body;
        const cognito = new CognitoService();
        let cog_response = ( cognito.signIn(username, password)).then((data) => {
            if(data['statusCode']){
                return res.status(data['statusCode']).json({message: data['message']}).end();
            }
            return res.status(200).json(data).end();
        }).catch((err) => {
            console.log("COG ERROR: " + JSON.stringify(err))
            return res.status(500).json({message: 'Unhandled error.'}).end();
        });
    }
    
    //Verify user based on email code, and create user in RDS.
    verify = async (req: Request, res: Response) => {
        //check if iit passes validation.
        const result = validationResult(req);
        console.log(req.body)
        if(!result.isEmpty()){
            return res.status(422).json({errors: result.array()})
        }
        const {username, code} = req.body;
        const cognito = new CognitoService();
        let cognito_succes = await cognito.verify(username, code)
        if(!cognito_succes){
            return res.status(500).json({message: 'Error with Cognito service.'}).end();
        }
        const rds = new RDSService();
        let rds_success = await rds.createUser(username);
        if(!rds_success){
            return res.status(500).json({message: 'Error with RDS servic.'}).end();
        }
        return res.status(200).json({message: 'Success'}).end();
    }

    //Validate the body based on the type.
    private validateBody(type: string){
        switch (type) {
            case 'signup': 
                return [
                    body('username').notEmpty().isLength({min: 3, max: 20}),
                    body('email').notEmpty().normalizeEmail().isEmail(),
                    body('password').isString().notEmpty().isLength({min: 6, max: 20}),
                    body('birthday').exists().notEmpty().isDate().isISO8601(),
                    body('name').notEmpty().isString(),
                    body('family_name').notEmpty().isString(),
                ]
            case 'signin': 
                return [
                    body('username').notEmpty().isLength({min: 3, max: 20}),
                    body('password').isString().notEmpty().isLength({min: 6, max: 20}),
                ]
            case 'verify': 
                return [
                    body('username').notEmpty().isLength({min: 3, max: 20}),
                    body('code').isString().isLength({min: 6, max: 6})
                ]
        }
    }
}
export default AuthController;