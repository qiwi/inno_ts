# inno_ts
Стандартная либа (файлы, использовавшиеся в ecom rnd проектах), оформленная в виде модуля.

## TODO
- own tslint
- refactoring, tests, etc ...

## Использование
Для сборки:
```
npm run build
```
Или
```
npm run watch
```
Sources: `/src/lib`
## Tests

```
npm run build
```
```
npm run test
```
Sources: `/src/test`

## Использование в коде
 
 Например:
 
 `import {Controller} from 'inno_ts'`

Важный момент: для использование OracleService на данный момент необходима
зависимость на oracledb (тестилось на 11 версии) в родительском проекте.
 