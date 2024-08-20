# Используем официальный образ Maven для сборки JAR файла
FROM maven:3.8.5-openjdk-17 AS build

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы проекта в контейнер
COPY . .

# Выполняем команду сборки, которая создаст JAR файл
RUN mvn clean package -DskipTests

# Используем минимальный образ JRE для запуска приложения
FROM openjdk:17-jdk-slim

# Устанавливаем рабочую директорию для запуска приложения
WORKDIR /app

# Копируем JAR файл из предыдущей стадии сборки
COPY --from=build /app/target/*.jar app.jar

# Указываем команду для запуска JAR файла
CMD ["java", "-jar", "app.jar"]
