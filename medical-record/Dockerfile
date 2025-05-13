FROM openjdk:17-jdk-alpine
ARG JAR_FILE=target/*.jar
COPY target/medical-record-0.0.1-SNAPSHOT.jar mr.jar
ENTRYPOINT ["java","-jar","/mr.jar"]
