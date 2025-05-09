FROM eclipse-temurin:23-jdk AS build
WORKDIR /app
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN ./mvnw dependency:go-offline -B
COPY src src
RUN ./mvnw package -Dmaven.test.skip=true -B

FROM eclipse-temurin:23-jdk
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
CMD ["java","-jar","app.jar"]
