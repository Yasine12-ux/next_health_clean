FROM openjdk:17-jdk-alpine
ARG JAR_FILE=target/*.jar
COPY ./config-server/target/config-server-0.0.1-SNAPSHOT.jar config-server.jar
ENTRYPOINT ["java", "-jar", "/config-server.jar"]
