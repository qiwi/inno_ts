import {Context} from "koa";
import {ClsService} from "../../services/cls_service";
import {Trace} from "../../trace";

const X_B3_TRACE_ID_HEADER = 'X-B3-TraceId';
const X_B3_SPAN_ID_HEADER = 'X-B3-SpanId';
const X_B3_PARENT_SPAN_ID_HEADER = 'X-B3-ParentSpanId';

export async function traceMiddleware(ctx: Context, next: () => Promise<void>): Promise<void> {
    const startTrace: Trace = new Trace(
        ctx.req.headers[X_B3_TRACE_ID_HEADER] as string,
        ctx.req.headers[X_B3_SPAN_ID_HEADER] as string,
        ctx.req.headers[X_B3_PARENT_SPAN_ID_HEADER] as string
    );

    return await ClsService.createCls(async () => {
        ClsService.setTrace(startTrace);
        const result = await next();

        const endTrace = ClsService.getTrace();

        ctx.set({
            [X_B3_TRACE_ID_HEADER]: endTrace.traceId,
            [X_B3_SPAN_ID_HEADER]: endTrace.spanId,
            [X_B3_PARENT_SPAN_ID_HEADER]: endTrace.parentSpanId
        });

        return result;
    });
}