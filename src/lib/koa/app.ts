import * as Koa from "koa";
import * as jwt from "koa-jwt";
import * as bodyParser from 'koa-bodyparser';
import {errorMiddleware} from './error_middleware';
import {successMiddleware} from './success_middleware';
import * as Router from 'koa-router';
import * as config from 'config';
import IConfig = config.IConfig;

export class App {
    public koa: Koa;

    constructor(config, router: Router) {
        this.initKoa(config, router);
    }

    private initKoa(config: IConfig, router: Router): void {
        const app = new Koa();
        const appPort = config.get('port');
        let jwtSecret = config.has('jwt.secret') ? config.get('jwt.secret') : null;

        app.use(bodyParser());
        app.use(errorMiddleware);
        if (jwtSecret) {
            app.use(jwt({secret: jwtSecret})
                .unless({
                    path: [
                        new RegExp(config.get<string>('jwt.publicPath'))
                    ]
                }));
        }
        app.use(router.routes());
        app.use(router.allowedMethods());
        app.use(successMiddleware);

        app.on('error', (err, ctx) => console.log('REQUEST_ERROR', err, ctx));
        process.on('uncaughtException', (err) => console.log('PROCESS_EXCEPTION', err.stack));

        app.listen(appPort, () => console.log('Server listening on port ' + appPort));
        this.koa = app;
    }
}

// непереведенные старые части
/*
 //CORS middleware
 var allowCrossDomain = function (req, res, next) {
 res.header('Access-Control-Allow-Origin', '*');
 res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
 res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

 next();
 };

 app.use(express.compress());
 app.use(express.favicon());
 if (env === 'development') {
 app.use(express.logger('dev'));
 }
 app.use(allowCrossDomain);
 app.disable('etag');

 router(app, {
 root: configs.url,
 controllersPath: 'application/controllers',
 authMiddleware: require('./application/middlewares/authentication')
 }).route();


 // Задачи cron
 var cronTasks = new (require('./cron_tasks'))();
 if (env != 'development') {
 cronTasks.init();
 }

 //Бот
 var TelegramBot = require('node-telegram-bot-api'),
 BotRouter = require('./application/bot/bot_router').BotRouter;

 var botApi = new TelegramBot(configs.botToken, {polling: true});

 var bot = new BotRouter(configs, botApi);
 bot.init();

 GLOBAL.bot = bot;*/