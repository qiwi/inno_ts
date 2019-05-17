"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const ts_graphite_decorator_1 = require("ts-graphite-decorator");
function Graphite(target, propertyKey, descriptor) {
    const graphiteDefaultKey = config.get('graphite.defaultKey');
    const graphiteUrl = config.get('graphite.url');
    const timingsKey = graphiteDefaultKey + 'timings.$method.';
    const rpmKey = graphiteDefaultKey + 'rpm.$method.';
    const RPMWrapped = ts_graphite_decorator_1.RPM(rpmKey + propertyKey, graphiteUrl)(target, propertyKey, descriptor);
    return ts_graphite_decorator_1.Metered(timingsKey + propertyKey, graphiteUrl)(RPMWrapped, propertyKey, descriptor);
}
exports.Graphite = Graphite;
//# sourceMappingURL=graphite.js.map