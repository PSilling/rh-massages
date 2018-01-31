FROM openjdk:8-jre-alpine
MAINTAINER PSilling

ADD /target/Massages-1.3.0.jar //
ADD /config.yml //
RUN java -jar Massages-1.3.0.jar db migrate config.yml
CMD java -jar Massages-1.3.0.jar server config.yml

EXPOSE 8080 8081
