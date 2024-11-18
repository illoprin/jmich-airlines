# Jmich Airlines
Летаем с одним крылом



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
Он может высрать ошибку 502 Bad Gateway — похуй, перезаходим в phpMyAdmin.

### Запуск проекта

```bash
cd backend
npm run backend
cd ../frontend
npm run frontend
```

Frontend приложение будет запущено по url `localhost:3001`.

Backend часть запущена на `localhost:8001`.
##### Можете поиграться с нею через postman 