import * as dotenv from 'dotenv';
dotenv.config();
import AWS from 'aws-sdk'
import crypto from 'crypto'


class CognitoService {
    private config = {
        region: process.env.AWS_REGION,
    }
    //Provided from AWS
    private secretHash: string = process.env.COGNITO_SECRET_HASH;
    //Provided from AWS
    private clientId: string = process.env.COGNITO_CLIENT_ID;
    private cognitoIdentity: AWS.CognitoIdentityServiceProvider;

    constructor() {
        this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider(this.config);
    }
    //Sign up a user
    public async signUp(username: string, password: string, userAttr: Array<any>): Promise<boolean> {
        const params = {
            ClientId: this.clientId,
            SecretHash: this.generateHash(username),
            Password: password,
            Username: username,
            UserAttributes: userAttr
        };

        try {
            const data = await this.cognitoIdentity.signUp(params).promise();
            console.log(data);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    //Sign in a user
    public async signIn(username: string, password: string): Promise<boolean> {
        const params = {
            ClientId: this.clientId,
            AuthFlow: 'USER_PASSWORD_AUTH',
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password,
                SECRET_HASH: this.generateHash(username)
            }
        };
        try {
            const data = await this.cognitoIdentity.initiateAuth(params).promise();
            console.log(data);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    //Confirm a user
    public async verify(username: string, code: string): Promise<boolean> {
        const params = {
            ClientId: this.clientId,
            SecretHash: this.generateHash(username),
            Username: username,
            ConfirmationCode: code
        };
        try {
            const data = await this.cognitoIdentity.confirmSignUp(params).promise();
            console.log(data);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    //Generate a secret hash for the user
    private generateHash (username:string): string {

        return crypto.createHmac('sha256', this.secretHash)
            .update(username + this.clientId)
            .digest('base64');
    }
}

export default CognitoService;