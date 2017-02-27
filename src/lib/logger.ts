import * as config from 'config';
import IConfig = config.IConfig;

import * as log4js from 'log4js'
import Logger = log4js.Logger;

export const DEFAULT_LOG_LEVEL = 'TRACE';

log4js.replaceConsole();
log4js.setGlobalLogLevel(DEFAULT_LOG_LEVEL);

export function getLogger(config: IConfig): Logger {
    const logger: Logger = log4js.getLogger();

    let logLevel = DEFAULT_LOG_LEVEL;
    if (config.has('logLevel')) {
        log4js.setGlobalLogLevel(config.get<string>('logLevel'));
        logLevel = config.get<string>('logLevel');
    }
    logger.setLevel(logLevel);

    return logger;
}