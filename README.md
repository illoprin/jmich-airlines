[Russian version](README.ru.md) | [English version](README.md)

# ✈️ JMICH Airlines - Cheap Flight Booking Service

![Image](https://raw.githubusercontent.com/illoprin/jmich-airlines/refs/heads/master/img/promo.jpg)

![Image](https://raw.githubusercontent.com/illoprin/jmich-airlines/refs/heads/master/img/main_page.jpg)

A web application for searching, booking, and managing flight tickets based on user preferences. Supports registration, personal accounts, ticket storage, and payment details.

## 🔧 Running the Project in Development Mode

Make sure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed.

```bash
git clone https://github.com/illoprin/jmich-airlines.git
cd jmich-airlines
docker compose up -d
```

After launching:

* Backend is available at: [http://localhost:8000](http://localhost:8000)
* Frontend (Vite) is available at: [http://localhost:80](http://localhost:80)

> ⚡ The project supports **hot reload** for both frontend and backend during development.


## ⚙️ Tech Stack

- **Node.js** - JS/TS development platform  
- **Express** - **backend** framework  
- **Redis** - caching system  
- **SQLite** - primary database  
- **Vue.js** - **frontend** framework  
- **Docker** - dev/prod deployment  


## 📌 Notes

* The project is under active development — instability may occur.  
* All data is temporary and may be deleted.  
* SQLite and Redis are used in dev mode, easily replaceable with production services.  
