import * as jsonWebToken from 'jsonwebtoken';
import * as config from 'config';

export class JwtService {
    static getToken(payload: any): string {
        return jsonWebToken.sign(payload, config.get<string>('appConfig.jwt.secret'));
    }
}