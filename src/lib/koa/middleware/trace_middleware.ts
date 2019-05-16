import {Context} from "koa";
import {appClsNamespace, MDC_KEY} from "../../continuation_local_storage";

const X_B3_TRACE_ID_HEADER = 'X-B3-TraceId';
const X_B3_SPAN_ID_HEADER = 'X-B3-SpanId';
const X_B3_PARENT_SPAN_ID_HEADER = 'X-B3-ParentSpanId';

export class Trace {
    constructor(
        public traceId: string = Trace._generateId(),
        public spanId: string = traceId,
        public parentSpanId: string = traceId) {

    }

    span() {
        this.parentSpanId = this.spanId;
        this.spanId = Trace._generateId();
    }

    toJSON() {
        return {
            traceId: this.traceId,
            spanId: this.spanId,
            parentSpanId: this.parentSpanId
        };
    }

    protected static _generateId(): string {
        return Date.now() + (Math.floor(Math.random() * 10)).toString(16);
    }
}

export async function traceMiddleware(ctx: Context, next: () => Promise<void>): Promise<void> {
    const startTrace: Trace = new Trace(
        ctx.req.headers[X_B3_TRACE_ID_HEADER] as string,
        ctx.req.headers[X_B3_SPAN_ID_HEADER] as string,
        ctx.req.headers[X_B3_PARENT_SPAN_ID_HEADER] as string
    );

    return await appClsNamespace.runPromise(async () => {
        appClsNamespace.set(MDC_KEY, startTrace);
        const result = await next();

        const endTrace = appClsNamespace.get(MDC_KEY) as Trace;

        ctx.set({
            [X_B3_TRACE_ID_HEADER]: endTrace.traceId,
            [X_B3_SPAN_ID_HEADER]: endTrace.spanId,
            [X_B3_PARENT_SPAN_ID_HEADER]: endTrace.parentSpanId
        });

        return result;
    })
}