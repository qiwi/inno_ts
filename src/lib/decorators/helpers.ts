import * as _ from "lodash";

export function getClassAndMethodName(self: any, methodName: string): string {
    let result = getClassName(self);
    if (result !== '') {
        result += '.';
    }
    result += methodName;
    return result;

}

export function getClassName(self: any): string {
    return _.get(self, 'name') || _.get(self, 'constructor.name', '');
}