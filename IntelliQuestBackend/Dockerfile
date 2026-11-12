# Build stage
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Cache dependencies
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B || true

# Copy source and build jar
COPY src src
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN apk add --no-cache curl

COPY --from=build /app/target/*.jar app.jar

EXPOSE 9092
ENV PORT=9092

ENTRYPOINT ["sh", "-c", "java -Xms128m -Xmx256m -XX:MaxMetaspaceSize=128m -Xss512k -XX:+UseSerialGC -Dserver.port=${PORT:-9092} -jar app.jar"]
