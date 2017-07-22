import {Context} from 'koa';

function clock(start?: any): any {
    if (!start) {
        return process.hrtime();
    }
    const end = process.hrtime(start);
    return (end[0] * 1000) + (end[1] / 1000000);
}

export async function logMiddleware(ctx: Context, next: () => any): Promise<void> {
    const startTime = clock();
    const startTimeString = startTime.join('');

    console.debug(`request ${startTimeString}`);
    console.debug('url href is', ctx.request.href);
    console.debug('ctx request is', ctx.request);
    console.debug('ctx request method is', ctx.request.method);
    console.debug('ctx request query is', ctx.request.query);
    console.debug('ctx request body is', ctx.request.body);

    const result = await next();

    console.debug(`Request ${startTimeString} finished in ${clock(startTime)} ms`);
    return result;
}