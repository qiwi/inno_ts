import * as _ from "lodash";
import {ClsService} from "../..";
import {DEFAULT_LOG_LEVEL, getLogger} from "../logger";

const traceSpanLogger = getLogger({logLevel: DEFAULT_LOG_LEVEL});

export function TraceSpan(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): any {
    const method = descriptor.value || target;

    const wrapper = function(): any {
        const currentTrace = ClsService.getTrace();
        if (currentTrace) {
            currentTrace.span();
        }
        traceSpanLogger.info('Start', getClassAndMethodName(this, propertyKey));
        let err;
        let isAsync: boolean = false;
        try {
            const methodResult = method.apply(this, arguments);
            if (methodResult.then) {
                // duck typing. but it is the only Promise definition.
                isAsync = true;
                methodResult.then(() => {
                    traceSpanLogger.info('End success', getClassAndMethodName(this, propertyKey));
                }).catch((err) => {
                    traceSpanLogger.info('End errored', getClassAndMethodName(this, propertyKey), err);
                });
            }
            return methodResult;
        } catch (e) {
            err = e;
            throw err;
        } finally {
            if (!isAsync) {
                if (err) {
                    traceSpanLogger.info('End errored', getClassAndMethodName(this, propertyKey), err);
                } else {
                    traceSpanLogger.info('End success', getClassAndMethodName(this, propertyKey));
                }
            }
        }
    };

    descriptor.value = wrapper;

    return wrapper;
}

function getClassAndMethodName(self: any, methodName: string): string {
    let result = _.get(self, 'constructor.name', '');
    if (result !== '') {
        result += '.';
    }
    result += methodName;
    return result;
}