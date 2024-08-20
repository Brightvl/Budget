[![Java](https://img.shields.io/badge/Java-17-blue.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green.svg)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13-blue.svg)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.0.0-yellow.svg)](https://vitejs.dev/)


Пример команды для docker PostgreSQL
 docker run --name appdb -e POSTGRES_USER=appUser -e POSTGRES_PASSWORD=appPass -e POSTGRES_DB=appdb -p 5432:5432 -d postgres

 Docker Command
 docker run --name ${app.db.name} -e POSTGRES_USER=${app.db.user} -e POSTGRES_PASSWORD=${app.db.password} -e POSTGRES_DB=${app.db.name} -p {app.db.port}:${app.db.port} -d postgres
  --name — задает имя контейнера.
  -e POSTGRES_PASSWORD=yourPassword — устанавливает пароль для пользователя PostgreSQL.
  -e POSTGRES_USER=yourUsername — устанавливает имя пользователя.
  -e POSTGRES_DB=app — создает базу данных с именем app.
  -p 5432:5432 — маппинг порта 5432 контейнера на порт 5432 хоста.
  -d postgres — запускает контейнер в фоновом режиме с последней версией PostgreSQL.
