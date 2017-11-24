# RH-massages

Red Hat massages management site.

## Starting the site

1. Go to `dropwizard-api` folder
1. Run `mvn clean install` to build your application
1. Populate DB schema with `java -jar target/Massages-1.0-SNAPSHOT.jar db config config.yml`
1. Start the application with `java -jar target/Massages-1.0-SNAPSHOT.jar server config.yml`
1. To check that your application is running enter url `http://localhost:8080`
1. Now go to `react-ui` folder
1. Run `npm install` to build your application
1. Start the application with `npm start`
1. To check that your application is running enter url `http://localhost:3000`

## DB environmental variables

The application supports these environmental variables for its database:

| VARIABLE        | MEANING                       | DEFAULT VALUE                             |
| --------------- |------------------------------ | ----------------------------------------- |
| RM_DB_USERNAME  | Database username             | postgres                                  |
| RM_DB_PASSWORD  | Database password             | postgres                                  |
| RM_DB_URL       | Database adress               | jdbc:postgresql://localhost:5432/postgres |
