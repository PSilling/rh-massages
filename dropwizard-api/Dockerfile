FROM openjdk:8-jre-alpine
MAINTAINER PSilling

ADD /target/Massages-1.2.3-SNAPSHOT.jar //
ADD /config.yml //
RUN java -jar Massages-1.2.3-SNAPSHOT.jar db migrate config.yml
CMD java -jar Massages-1.2.3-SNAPSHOT.jar server config.yml

EXPOSE 8080 8081
