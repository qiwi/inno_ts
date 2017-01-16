# inno_ts

Стандартная либа (файлы, использовавшиеся в ecom rnd проектах), оформленная в виде модуля.

## TODO

- own tslint
- refactoring, tests, etc ...

## Установка
 `npm install git+ssh://git@github.qiwi.com:ecom-rnd/inno_ts.git#fdff919f5d52cd1f3e0536349e86c29b402b2ed0 --save`
 
 В случае, если будет ругаться на public key (`Permission denied`), добавляем ключ для своего профиля на github.qiwi.com:
 
 https://help.github.com/enterprise/2.8/user/articles/connecting-to-github-with-ssh/
 
 Процедура быстрая - займет около 10 минут.
 
## Использование в коде
 
 Например:
 
 `import {Controller} from 'inno_ts`
 