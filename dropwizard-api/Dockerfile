FROM openjdk:8-jre-alpine
MAINTAINER PSilling

ADD /target/Massages-*.jar //
ADD /config.yml //
RUN java -jar Massages-*.jar db migrate config.yml
CMD java -jar Massages-*.jar server config.yml

EXPOSE 8080 8081
