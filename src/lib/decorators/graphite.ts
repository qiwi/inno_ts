import {Metered, RPM} from 'ts-graphite-decorator';
import {getClassAndMethodName} from "./helpers";

export function Graphite(graphiteDefaultKey: string, graphiteUrl: string): MethodDecorator {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void => {
        const timingsKey = graphiteDefaultKey + 'timings.$method.';
        const rpmKey = graphiteDefaultKey + 'rpm.$method.';

        const classAndMethodName = getClassAndMethodName(this, propertyKey);

        const rpmWrapped = RPM(rpmKey + propertyKey, graphiteUrl)(target, classAndMethodName, descriptor);

        return Metered(timingsKey + propertyKey, graphiteUrl)(rpmWrapped, classAndMethodName, descriptor);
    };
}