# ЖМЫХ Airlines
### Летаем с одним крылом

![Image](https://github.com/user-attachments/assets/dc9315d1-fcca-47a3-8e9c-9674d582e632)

> [!NOTE]
> Описание концепции и реализации проекта можно посмотреть в презентации по ссылке
> 
> [Презентация](https://docs.google.com/presentation/d/1osGXwMDT6Vueaqa-380vfUvSET5TBMnxaBh9zHBM02A/edit?usp=sharing)

# Инструкция по запуску проекта

### Установка зависимостей

```bash
git clone https://github.com/illoprin/jmich-airlines.git
cd jmich-airlines\backend
npm install
cd ..\frontend 
npm install
```

### Установка базы данных

Тут понадобится mySQL не раньше версии 5.7. Заходим в phpMyAdmin, в верхнем меню есть раздел Import. Там через Choose File загружаем jmich.sql и в самом низу страницы нажимаем Import.
Может вылететь ошибка 502 Bad Gateway - не обращаем внимания, перезагружаем страницу.

Создаём в директории backend файл .env.

```.env
DB_HOST=localhost
DB_USER=/*Имя пользователя MySQL*/
DB_PASSWORD= /*Пароль пользователя MySQL*/
DB_NAME=jmich
PORT=8001
SALT=8
SECRET='SECRET_KEY_RANDOM'
```

### Запуск проекта

```bash
cd backend
npm run backend
cd ../frontend
npm run frontend
```


> [!NOTE]
> Проект не работает под Linux. Причина - какая-то проблема с зависимостями.
> Frontend приложение будет запущено по url `localhost:3001`.
> Backend часть запущена на `localhost:8001`.
> Все точки входа Rest API обозначены в исходном коде, можете поиграться с беком через Postman