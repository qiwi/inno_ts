import * as _ from "lodash";

export function getClassAndMethodName(self: any, methodName: string): string {
    let result = _.get(self, 'constructor.name', '');
    if (result !== '') {
        result += '.';
    }
    result += methodName;
    return result;
}