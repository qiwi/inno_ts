import {Metered, RPM} from 'ts-graphite-decorator';
import {getClassAndMethodName} from "./helpers";

export function Graphite(graphiteDefaultKey: string, graphiteUrl: string): MethodDecorator {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void {
        const timingsKey = graphiteDefaultKey + 'timings.$method.';
        const rpmKey = graphiteDefaultKey + 'rpm.$method.';

        const classAndMethodName = getClassAndMethodName(this, propertyKey);

        RPM(rpmKey + propertyKey, graphiteUrl)(target, classAndMethodName, descriptor);
        Metered(timingsKey + propertyKey, graphiteUrl)(target, classAndMethodName, descriptor);
    };
}