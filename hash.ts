import * as crypto from 'crypto';

export class Hash {
    public static getSha256(value: string): string {
        return crypto.createHash('sha256').update(value).digest('hex');
    }
}