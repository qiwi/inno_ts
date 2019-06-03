/**
 * Adds provided decorator for each method of a class.
 * Caution: no function expressions will be decorated.
 */
export function AllMethods(decorator: MethodDecorator): any {
    return (target: any): any => {
        Object.getOwnPropertyNames(target.prototype).forEach((key: string) => {
            const value = target.prototype[key];
            const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
            if (typeof value !== 'function'
                || key === 'constructor'
            ) {
                return;
            }
            target.prototype[key] = decorator(value, key, descriptor);
        });
        return target;
    };
}
