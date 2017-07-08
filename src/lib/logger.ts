import * as log4js from 'log4js';
import Logger = log4js.Logger;
import {IAppConfig} from './koa/interfaces';

export const DEFAULT_LOG_LEVEL = 'TRACE';

log4js.replaceConsole();
log4js.setGlobalLogLevel(DEFAULT_LOG_LEVEL);

export function getLogger(config: IAppConfig): Logger {
    const logger: Logger = log4js.getLogger();

    let logLevel = DEFAULT_LOG_LEVEL;
    if (config.logLevel) {
        log4js.setGlobalLogLevel(config.logLevel);
        logLevel = config.logLevel;
    }
    logger.setLevel(logLevel);

    return logger;
}