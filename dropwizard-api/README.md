# Dropwizard-API

Backend of Red Hat Massages management site.

## Starting the application

1. Run `mvn clean package` to build your application
2. Populate DB schema with `java -jar target/Massages-<VERSION>-SNAPSHOT.jar db migrate config.yml`
3. Start the application with `java -jar target/Massages-<VERSION>-SNAPSHOT.jar server config.yml`
4. To check that your application is running enter url `http://localhost:8080`

Replace `<VERSION>` with the version of your build.

If you really want to build the server separately however, you need to remove the UI client from the dependencies.

## Health Check

To see your applications health enter url `http://localhost:8081/healthcheck`.
