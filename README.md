# RH-massages

Red Hat massages management site.

## Travis CI

[![Build Status](https://travis-ci.org/PSilling/rh-massages.svg?branch=master)](https://travis-ci.org/PSilling/rh-massages)

## Starting the application

1. Run `mvn clean package` to build your application
1. Populate DB schema with `java -jar target/Massages-<VERSION>.jar db migrate config.yml`
1. Start the server application with `java -jar target/Massages-<VERSION>.jar server config.yml`
1. To check that your application is running enter `http://localhost:8080`

Replace `<VERSION>` with the version of your build.

## Environmental variables

The application supports these environmental variables for the database:

| VARIABLE        | MEANING                       | DEFAULT VALUE                             |
| --------------- |------------------------------ | ----------------------------------------- |
| RM_DB_USERNAME  | Database username             | postgres                                  |
| RM_DB_PASSWORD  | Database password             | postgres                                  |
| RM_DB_URL       | Database address              | jdbc:postgresql://localhost:5432/postgres |

The application supports these environmental variables for server Keycloak configuration:

| VARIABLE        | MEANING                       | DEFAULT VALUE                             |
| --------------- |------------------------------ | ----------------------------------------- |
| KC_REALM        | Keycloak realm name           | massages                                  |
| KC_SERVER       | Keycloak server URL           | http://localhost:9090/auth                |
| KC_RESOURCE     | Application resource name     | api-client                                |
| KC_SECRET       | Keycloak secret               | b4a1ee69-6441-49a0-b653-e2875234c0ef      |

The application supports these environmental variables for the SMTP server:

| VARIABLE        | MEANING                       | DEFAULT VALUE                             |
| --------------- |------------------------------ | ----------------------------------------- |
| SMTP_SERVER     | SMTP server name              | localhost                                 |
| SMTP_PORT  	  | SMTP server port              | 587                                       |
| SMTP_USERNAME   | SMTP username                 | –                                         |
| SMTP_PASSWORD   | SMTP password                 | –                                         |
| SMTP_FROM_EMAIL | SMTP sender email             | portal@massages.com                       |
| SMTP_FROM_NAME  | SMTP sender name              | admin                                     |


## Keycloak setup

The application requires Keycloak server to be configured. For configuration you can use environmental variables (see above).
Keycloak server client should connect to the server and should be set as `bearer-only`.
Keycloak UI client should connect to the UI and should be `public` with server URL (`http://localhost:8080/*`) `Redirect URI` mapping.
Example Keycloak setup (uses defualt values) can be found [here](https://github.com/PSilling/rh-massages/blob/master/dropwizard-api/docs/keycloak-export.json).

The client then requires a `keycloak.json` configuration file to be supplied in `react-ui/public` folder.
Example client configuration file can be found [here](https://github.com/PSilling/rh-massages/blob/master/dropwizard-api/docs/keycloak-config.json). The file can also be extracted directly from Keycloak.

## Docker

The application can be easily started using Docker using its [Dockerfile](https://github.com/PSilling/rh-massages/blob/master/dropwizard-api/Dockerfile).
The container needs to be connected to a database to be usable, however.
