# Используем официальный образ Maven для сборки артефакта
FROM maven:3.9.3-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Используем официальный образ JRE для запуска приложения
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/your-thymeleaf-artifact.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java","-jar","app.jar"]
