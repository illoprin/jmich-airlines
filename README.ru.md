[Russian version](README.ru.md) | [English version](README.md)

# ✈️ ЖМЫХ Airlines - Сервис для покупки дешёвых авиабилетов

![Image](https://raw.githubusercontent.com/illoprin/jmich-airlines/refs/heads/master/img/promo.jpg)

![Image](https://raw.githubusercontent.com/illoprin/jmich-airlines/refs/heads/master/img/main_page.jpg)

Веб-приложение, позволяющее искать, бронировать и управлять авиабилетами с учётом пользовательских предпочтений. Поддерживает регистрацию, личный кабинет, сохранение билетов и платёжных данных.

## 🔧 Запуск проекта в режиме разработки

Убедитесь, что установлен [Docker](https://www.docker.com/) и [Docker Compose](https://docs.docker.com/compose/).

```bash
git clone https://github.com/illoprin/jmich-airlines.git
cd jmich-airlines
docker compose up -d
````

После запуска:

* Backend доступен по адресу: [http://localhost:8000](http://localhost:8000)
* Frontend (Vite) доступен по адресу: [http://localhost:80](http://localhost:80)

> ⚡ Проект поддерживает **горячую перезагрузку** (hot reload) для frontend и backend во время разработки.


## ⚙️ Стек

- **Node.js** - платформа для разработки на JS/TS
- **Express** - **backend** фреймворк
- **Redis** - система кеширования
- **SQlite** - основная СУБД
- **Vue.js** - **frontend** фреймворк
- **Docker** - dev/prod развёртывание


## 📌 Примечания

* Проект в стадии активной разработки — возможны нестабильности.
* Все данные временные и могут быть удалены.
* Используется SQLite и Redis в dev-режиме, легко заменить на прод-сервисы.
