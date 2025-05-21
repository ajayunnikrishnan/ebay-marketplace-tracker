FROM eclipse-temurin:23-jdk-alpine as build

# Set working directory
WORKDIR /app

# Copy Maven wrapper and download dependencies
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN ./mvnw dependency:go-offline -B

# Copy source and build the project
COPY . .
RUN ./mvnw package -DskipTests -B

# Stage 2: Runtime image
FROM eclipse-temurin:23-jre-alpine

WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
