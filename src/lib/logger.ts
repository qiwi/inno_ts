import * as log4js from 'log4js';
import {LoggingEvent} from 'log4js';
import {IAppConfig} from './koa/interfaces';
import Logger = log4js.Logger;
import {ClsService} from "./services/cls_service";

export const DEFAULT_LOG_LEVEL = 'TRACE';

export function getLogger(config: IAppConfig): Logger {
    const logLevel = config.logLevel || DEFAULT_LOG_LEVEL;
    log4js.addLayout('json', (config) => {
        return (logEvent: LoggingEvent) => {
            logEvent.context = {
                service: process.env.service_name,
                mdc: ClsService.getTrace()
            };
            return JSON.stringify(logEvent);
        };
    });
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
            default: {appenders: ['out'], level: logLevel}
        }
    });

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