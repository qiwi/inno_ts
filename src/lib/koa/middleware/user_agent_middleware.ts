import * as userAgent from 'koa-useragent';

const userAgentMiddleware = userAgent();

export {userAgentMiddleware}