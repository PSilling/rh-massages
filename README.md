# RH-massages

Red Hat massages management site.

## CI

[![Build Status](https://travis-ci.org/PSilling/rh-massages.svg?branch=master)](https://travis-ci.org/PSilling/rh-massages)

## Starting the application

1. Run `mvn clean install` to build your application
1. Populate DB schema with `java -jar target/Massages-1.2.1-SNAPSHOT.jar db config config.yml`
1. Start the server application with `java -jar target/Massages-1.2.1-SNAPSHOT.jar server config.yml`
1. To check that your application is running enter `http://localhost:8080`

## DB environmental variables

The application supports these environmental variables for its database:

| VARIABLE        | MEANING                       | DEFAULT VALUE                             |
| --------------- |------------------------------ | ----------------------------------------- |
| RM_DB_USERNAME  | Database username             | postgres                                  |
| RM_DB_PASSWORD  | Database password             | postgres                                  |
| RM_DB_URL       | Database address              | jdbc:postgresql://localhost:5432/postgres |

The application supports these environmental variables for its SMTP server:

| VARIABLE        | MEANING                       | DEFAULT VALUE                             |
| --------------- |------------------------------ | ----------------------------------------- |
| SMTP_SERVER     | SMTP server name              | localhost                                 |
| SMTP_PORT  	  | SMTP server port              | 587                                       |
| SMTP_USERNAME   | SMTP username                 | –                                         |
| SMTP_PASSWORD   | SMTP password                 | –                                         |
| SMTP_FROM_EMAIL | SMTP sender email             | admin@massages.com                        |
| SMTP_FROM_NAME  | SMTP sender name              | admin                                     |


## Keycloak setup

The application requires this Keycloak setup to work properly:

| ITEM            | VALUE                   |
| --------------- |-------------------------|
| Port            | 9090                    |
| Realm           | Massages                |
| Realm roles     | admin, user             |
| Realm clients   | api-client, ui-client   |

Client `api-client` should connect to the server (correct secret (variable `KC_CONFIG_SECRET`) needs to be suplied) and should be set as `bearer-only`.
Client `ui-client` should connect to the ui and should be set as `public` with `http://localhost:8080/*` as its `Redirect URI`.
Example Keycloak setup can be found [here](https://github.com/PSilling/rh-massages/blob/master/dropwizard-api/docs/keycloak-export.json).

## Docker

The application can be easily started using Docker with its [Dockerfile](https://github.com/PSilling/rh-massages/blob/master/dropwizard-api/Dockerfile).
The container needs to be connected to a database to be usable, however.
