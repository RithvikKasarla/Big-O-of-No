import * as dotenv from 'dotenv';
dotenv.config();

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
//Import fetch in a way that doesn't break ESM module loading
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

let pems: {[key: string]:any } = {};

class AuthMiddleware {
    private poolRegion: string = process.env.AWS_REGION;
    private userPoolId: string = process.env.COGNITO_USER_POOL_ID;
    
    
    constructor () {
        this.setUp();
    }
    
    verifyToken(req: Request, res: Response, next): void {
        const { token } = req.body;
        console.log(token)
        if (!token) {
            console.log("No token")
            res.status(401).end();
            return;
        }
        
        let decodedJwt: any = jwt.decode(token, { complete: true });
        if (decodedJwt === null) {
            console.log("Invalid token")
            res.status(401).end()
            return;
        }
        console.log(decodedJwt)
        //check if token is expired
        let kid = decodedJwt.header.kid;
        //look up the pem
        let pem = pems[kid];
        if(!pem){
            res.status(401).json({ message: 'Unauthorized, kId not in pem' }).end();
        }
        //verify the signature
        jwt.verify(token, pem, (err, payload) => {
            if(err){
                res.status(401).json({ message: 'Unauthorized, jwt not verified.' }).end();
            }else{
                console.log("JWT Verified");
                next(); //Call the next middleware
            }
        });
    }
    verifyAdmin(req: Request, res: Response, next): void {
        const {admin_password} = req.body;
        if(admin_password != process.env.HOST_ADMIN_PASSWORD){
            res.status(401).json({ message: 'Unauthorized, admin_password incorrect.' }).end();
        }else{
            console.log("Admin verified")
            next();
        }
    }
    
    private async setUp(){
        const URL = `https://cognito-idp.${this.poolRegion}.amazonaws.com/${this.userPoolId}/.well-known/jwks.json`
        
        try {
            const response = await fetch(URL);
            if (response.status !== 200) {
                throw "Request failed"
            }
            const data = await response.json();
            const keys = data['keys'];
            for(let i = 0; i < keys.length; i++){
                const key = keys[i];
                const keyId = key.kid;
                const modulus = key.n;
                const exponent = key.e;
                const keyType = key.kty;
                const jwk = { kty: keyType, n: modulus, e: exponent };
                const pem = jwkToPem(jwk);
                pems[keyId] = pem;
            }
            console.log("Got all pems")
        } catch (error) {
            console.log("Error getting pems: ", error);
        }
    }
}

export default AuthMiddleware;