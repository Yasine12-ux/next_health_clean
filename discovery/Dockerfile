FROM openjdk:17-jdk-alpine
ARG JAR_FILE=target/*.jar
COPY target/discovery-0.0.1-SNAPSHOT.jar eureka-server.jar
ENTRYPOINT ["java", "-jar", "/eureka-server.jar"]