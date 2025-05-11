FROM openjdk:17-jdk-alpine
ARG JAR_FILE=target/*.jar
COPY ./appointments/target/appointments-0.0.1-SNAPSHOT.jar rdv.jar
ENTRYPOINT ["java","-jar","/rdv.jar"]
