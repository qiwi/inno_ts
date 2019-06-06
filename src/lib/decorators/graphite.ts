import {Metered, RPM} from 'ts-graphite-decorator';
import {getClassAndMethodName} from "./helpers";

export function Graphite(graphiteDefaultKey: string, graphiteUrl: string): MethodDecorator {
    return function(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): any {
        const timingsKey = graphiteDefaultKey + 'timings.$method.';
        const rpmKey = graphiteDefaultKey + 'rpm.$method.';

        const classAndMethodName = getClassAndMethodName(this, propertyKey);

        RPM(rpmKey + classAndMethodName, graphiteUrl)(target, classAndMethodName, descriptor);
        Metered(timingsKey + classAndMethodName, graphiteUrl)(target, classAndMethodName, descriptor);
        return descriptor.value;
    };
}