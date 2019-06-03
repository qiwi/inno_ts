import {TraceSpan} from "./trace_span";
import {AllMethods} from "./all_methods";

/**
 * Adds TraceSpan decorator for each method of a class.
 * Caution: no function expressions will be decorated.
 */
export function TracedClass(): any {
    return AllMethods(TraceSpan);
}
