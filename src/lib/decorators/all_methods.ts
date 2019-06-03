/**
 * Adds provided decorator for each method of a class.
 * Caution: no function expressions will be decorated.
 */
export function AllMethods(decorator: MethodDecorator): any {
    return (target: any): any => {
        Object.getOwnPropertyNames(target.prototype).forEach((key: string) => {
            const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
            if (typeof descriptor.value !== 'function'
                || key === 'constructor'
            ) {
                return;
            }
            target.prototype[key] = decorator(descriptor.value, key, descriptor);
        });
        return target;
    };
}
