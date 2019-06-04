/**
 * Adds provided decorator for each method of a class.
 * Caution: no function expressions will be decorated. Also methods start with '_' will be ignored
 */
export function AllMethods(decorator: MethodDecorator): any {
    return (target: any): any => {
        Object.getOwnPropertyNames(target.prototype).forEach((key: string) => {
            const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
            if (typeof descriptor.get !== 'undefined'
                || typeof descriptor.set !== 'undefined'
                || key === 'constructor'
                || key[0] === '_'
            ) {
                return;
            }
            // some decorators work with descriptor.value. some returns new method.
            // call decorator in target scope
            const decoratorResult = decorator.call(target, target.prototype[key], key, descriptor);
            if (decoratorResult) {
                target.prototype[key] = decoratorResult;
            }
        });
        return target;
    };
}
