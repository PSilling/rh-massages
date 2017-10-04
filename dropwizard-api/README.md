# Dropwizard-api

Backend of RH-massages site.

## Starting the application

1. Run `mvn clean install` to build your application
1. Populate DB schema with `java -jar target/Massages-1.0-SNAPSHOT.jar db config config.yml`
1. Start the application with `java -jar target/Massages-1.0-SNAPSHOT.jar server config.yml`
1. To check that your application is running enter url `http://localhost:8080`

## Health Check

To see your applications health enter url `http://localhost:8081/healthcheck`
