"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const innots_1 = require("innots");
const inversify_config_1 = require("../container/inversify.config");
const types_1 = require("../container/types");
const _ = require("lodash");
function TraceSpan(target, propertyKey, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        const currentTrace = innots_1.ClsService.getTrace();
        currentTrace.span();
        inversify_config_1.defaultContainer.get(types_1.TYPES.constant.defaultLogger).info(getClassAndMethodName(this, propertyKey), currentTrace);
        return method.apply(this, arguments);
    };
}
exports.TraceSpan = TraceSpan;
function getClassAndMethodName(self, methodName) {
    let result = _.get(self, 'constructor.name', '');
    if (result !== '') {
        result += '.';
    }
    result += methodName;
    return result;
}
//# sourceMappingURL=trace_span.js.map