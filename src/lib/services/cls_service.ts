import * as cls from "cls-hooked";
import {Trace} from "../trace";

const appClsNamespace = cls.createNamespace('InnotsApp');

/**
 * This restricts Continuation-local storage direct access
 * Nothing but trace should be there.
 */
export class ClsService {
    public static getTrace(): Trace {
        return appClsNamespace.get(ClsService.MDC_KEY);
    }
    public static setTrace(trace: Trace): void {
        appClsNamespace.set(ClsService.MDC_KEY, trace);
    }
    public static async createCls(fn: (...args: any[]) => Promise<any>): Promise<void> {
        return await appClsNamespace.runPromise(fn);
    }
    protected static MDC_KEY: string = 'mappedDiagnosticContext';
}