import * as log4js from 'log4js';
import {Configuration, LoggingEvent} from 'log4js';
import {IAppConfig} from './koa/interfaces';
import Logger = log4js.Logger;
import {ClsService} from "./services/cls_service";

export const DEFAULT_LOG_LEVEL = 'TRACE';

export function createLoggerJsonLayout(appConfig: IAppConfig): void {
    log4js.addLayout('json', (loggerConfig: Configuration) => {
        return (logEvent: LoggingEvent) => {
            const loggedObject = {
                startTime: logEvent.startTime,
                levelStr: logEvent.level.levelStr,
                application: appConfig.appName,
                mdc: ClsService.getTrace(),
                message: logEvent.data.map((data) => typeof data === "object" ? JSON.stringify(data) : data)
            };
            return JSON.stringify(loggedObject);
        };
    });
}

export function configureLogger(appConfig: IAppConfig): void {
    log4js.configure({
        appenders: {
            out: {
                type: 'stdout',
                layout: {
                    type: 'json'
                }
            }
        },
        categories: {
            default: {appenders: ['out'], level: appConfig.logLevel || DEFAULT_LOG_LEVEL}
        },
        pm2: appConfig.pm2
    });
}

export function getLogger(config: IAppConfig): Logger {
    createLoggerJsonLayout(config);
    configureLogger(config);

    return log4js.getLogger();
}

export function replaceConsoleWithLogger(logger: Logger): void {
    /* tslint:disable */
    // https://github.com/log4js-node/log4js-node/blob/master/docs/faq.md#what-happened-to-replaceconsole---it-doesnt-work-any-more
    console.log = logger.log.bind(logger);
    console.trace = logger.trace.bind(logger);
    console.debug = logger.debug.bind(logger);
    console.warn = logger.warn.bind(logger);
    console.error = logger.error.bind(logger);
}