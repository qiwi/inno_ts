import {Metered, RPM} from 'ts-graphite-decorator';

export function Graphite(graphiteDefaultKey: string, graphiteUrl: string): MethodDecorator {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void => {
        const timingsKey = graphiteDefaultKey + 'timings.$method.';
        const rpmKey = graphiteDefaultKey + 'rpm.$method.';

        const rpmWrapped = RPM(rpmKey + propertyKey, graphiteUrl)(target, propertyKey, descriptor);

        return Metered(timingsKey + propertyKey, graphiteUrl)(rpmWrapped, propertyKey, descriptor);
    };
}