import {AllMethods} from "./all_methods";
import {Graphite} from "./graphite";

/**
 * Adds TraceSpan decorator for each method of a class.
 * Caution: no function expressions will be decorated.
 */
export function GraphiteClass(graphiteDefaultKey: string, graphiteUrl: string): any {
    return AllMethods(Graphite(graphiteDefaultKey, graphiteUrl));
}
