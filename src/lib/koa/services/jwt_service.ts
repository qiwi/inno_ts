import * as jsonWebToken from 'jsonwebtoken';
import { IAppJwtConfig } from "../interfaces";

export class JwtService {
    protected secretKey: string;

    constructor(config: IAppJwtConfig) {
        this.secretKey = config.secret;
    }

    public getToken(payload: any): string {
        return jsonWebToken.sign(payload, this.secretKey);
    }
}