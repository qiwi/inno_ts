import {Metered, RPM} from 'ts-graphite-decorator';
import {getClassName} from "./helpers";

export function Graphite(graphiteDefaultKey: string, graphiteUrl: string): MethodDecorator {
    return function(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): any {
        const timingsKey = graphiteDefaultKey + getClassName(this) + '.timings.' + propertyKey;
        const rpmKey = graphiteDefaultKey + getClassName(this) + '.rpm.' + propertyKey;

        RPM(rpmKey, graphiteUrl)(target, propertyKey, descriptor);
        Metered(timingsKey, graphiteUrl)(target, propertyKey, descriptor);
        return descriptor.value;
    };
}