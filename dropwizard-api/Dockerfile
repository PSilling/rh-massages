FROM openjdk:jre-8-alpine
MAINTAINER PSilling

ADD /dropwizard-api/src/main/resources/docker/start.sh //
ADD /dropwizard-api/target/Massages-1.3.0.jar //
ADD /dropwizard-api/config.yml //

ENTRYPOINT ["sh", "start.sh"]
CMD ["start"]

EXPOSE 8080 8081..
