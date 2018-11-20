FROM openjdk:8-jre-alpine
MAINTAINER PSilling

ADD /src/main/resources/docker/start.sh //
ADD /target/Massages-1.4.6.jar //
ADD /config.yml //

ENTRYPOINT ["sh", "start.sh"]
CMD ["start"]

EXPOSE 8080 8081
