import * as _ from "lodash";
import {ClsService} from "../..";
import {DEFAULT_LOG_LEVEL, getLogger} from "../logger";

const traceSpanLogger = getLogger({logLevel: DEFAULT_LOG_LEVEL});

export function TraceSpan(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void {
    const method = descriptor.value;

    descriptor.value = function(): any {
        const currentTrace = ClsService.getTrace();
        currentTrace.span();
        traceSpanLogger.info(getClassAndMethodName(this, propertyKey));
        return method.apply(this, arguments);
    };
}

function getClassAndMethodName(self: any, methodName: string): string {
    let result = _.get(self, 'constructor.name', '');
    if (result !== '') {
        result += '.';
    }
    result += methodName;
    return result;
}