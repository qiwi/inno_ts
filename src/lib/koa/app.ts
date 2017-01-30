import * as Koa from "koa";
import * as jwt from "koa-jwt";
import * as bodyParser from 'koa-bodyparser';
import {errorMiddleware} from './error_middleware';
import * as Router from 'koa-router';

export class App {
    public koa: Koa;

    constructor(config, router: Router) {
        this.initKoa(config, router);
    }

    private initKoa(config: any, router: Router): void {
        const app = new Koa();
        const appPort = config.get('port');

        app.use(bodyParser());
        app.use(errorMiddleware);
        app.use(jwt({secret: config.get('secret')}).unless({path: [new RegExp('^\/public')]}));
        app.use(router.routes());
        app.use(router.allowedMethods());

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