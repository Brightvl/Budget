[![Java](https://img.shields.io/badge/Java-17-blue.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green.svg)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13-blue.svg)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.0.0-yellow.svg)](https://vitejs.dev/)


# Приложение для управления целями
(Ранний доступ)
## Обзор проекта

Приложение для управления целями — это полнофункциональное веб-приложение, предназначенное для помощи пользователям в постановке, отслеживании и достижении личных и профессиональных целей. Приложение предоставляет функции для создания целей, управления задачами, отслеживания прогресса и аутентификации пользователей. Проект построен с использованием современных технологий, таких как Java Spring Boot для серверной части, React для клиентской части и PostgreSQL для базы данных. Приложение контейнеризировано с использованием Docker для упрощения развертывания и масштабируемости.

## Основные функции

- **Аутентификация пользователей:** Безопасная регистрация и вход в систему с использованием аутентификации на основе JWT.
- **Управление целями:** Создание, обновление, удаление и отслеживание прогресса выполнения целей.
- **Управление задачами:** Управление задачами, связанными с каждой целью.
- **Ролевое управление доступом:** Роли администратора и пользователя с различными уровнями доступа.
- **Адаптивный дизайн:** Удобный интерфейс, построенный с использованием React.
- **Интеграция API:** Взаимодействие между фронтендом и бэкендом через RESTful API.

## Используемые технологии

### Серверная часть:
- **Java 17**
- **Spring Boot**
- Spring Web
- Spring Security
- Spring Data JPA
- **PostgreSQL**
- **JWT (JSON Web Token)**
- **Docker**

### Клиентская часть:
- **React**
- **Vite**
- **Sass**
- **JavaScript**

### Развертывание:
- **Docker Compose**

## Установка и настройка

Для запуска проекта на локальной машине выполните следующие шаги:

1. **Клонируйте репозиторий:**
```bash
git clone https://github.com/Brightvl/Goal.git
cd Goal
```
2. Собрать проект
- Перейдите в корневую директорию папки Goal
- Соберите Docker-compose
  ```bash
     docker-compose up --build
  ```
- Серверная часть будет запущена на http://localhost:8080.
- Клиентская часть будет доступна по адресу http://localhost:3000.

### Локальное сохранение и использование

- Сохранение локального образа (если необходимо)
```bash
docker save -o docker_image/goal-backend.tar goal-backend:latest
docker save -o docker_image/goal-frontend.tar goal-frontend:latest
docker save -o docker_image/postgres-15-alpine.tar postgres:15-alpine

```
- Воспользоваться уже собранным вариантом (только после того как сохранили локально)
```bash
# корень программы
docker load -i docker_image/goal-backend.tar
docker load -i docker_image/goal-frontend.tar
docker load -i docker_image/postgres-15-alpine.tar

docker-compose up
```

## Использование
- Вход/Регистрация: Создайте учетную запись или войдите в систему для управления вашими целями.
- Панель управления: Просматривайте и управляйте своими целями и задачами.
- Административная панель: Администраторы могут управлять учетными записями пользователей и сбрасывать пароли.

## Участники проекта
[Iaroslav Sirota] - Full-stack разработчик


## Контакты

Если у вас есть вопросы или предложения, свяжитесь со мной по ziro-x-100@mail.ru

