# RH-massages

Red Hat massages management site.

## Travis CI

[![Build Status](https://travis-ci.org/PSilling/rh-massages.svg?branch=master)](https://travis-ci.org/PSilling/rh-massages)

## Starting up the application

This guide will be using the default settings. By using environmental variables (see below) you can easily configure the application.
To run the application you'll need to download Java, PostgreSQL, Keycloak, Maven and Node.js.

1. Create and start a local PostgreSQL database on port `5432` with username and password set to `postgres`.
2. Start the Keycloak standalone server on port `9090` (offset `1010`). Also setup a new administrator console account.
3. Configure Keycloak based on the Keycloak setup below. For more information visit the official [Keycloak documentation](http://www.keycloak.org/docs/latest/getting_started/index.html).
4. Clone or download the GitHub repository to your computer.
5. Move the downloaded client configuration `keycloak.json` file to the `react-ui/public` folder.
6. In the root folder of the project run `mvn clean package` to build your application.
7. Also populate the database scheme with `java -jar target/Massages-<VERSION>.jar db migrate config.yml`.
8. Then you can start the application by running `java -jar target/Massages-<VERSION>.jar server config.yml`.
9. To check that your application is actually running go to `http://localhost:8080`.

Replace `<VERSION>` with the version of your build (can be found in `pom.xml`).

## Keycloak setup

The application requires Keycloak server to be configured (environmental variables are supported).
In the Keycloak administration console you need to create a new realm called `Massages`. In this realm 2 new authorization clients need to be created:

1. `api-client` for server communication that has `bearer-only` Access Type.
2. `ui-client` for client communication that has `public` Access Type with a single Valid Redirect URI set to `http://localhost:8080/*`.

Then switch to the Roles tab and create 2 new roles: `admin` (for administrators) and `user` (for normal users).
Afterwards you can create new users with given roles in the Users tab, but before using the authentication server you need to remove SSL verification in realm's Login settings. There you can also enable other features like registration on the login page etc.
After disabling the SSL verification go back to `ui-client` setup, select its Installation tab and downlaod the JSON configuration file, which you will need to configure the UI client later.

Example Keycloak realm setup with default values can be found [here](https://github.com/PSilling/rh-massages/blob/master/dropwizard-api/docs/keycloak-export.json) and should be importable to the administration console.
Example client configuration JSON can be found [here](https://github.com/PSilling/rh-massages/blob/master/dropwizard-api/docs/keycloak-config.json) and should be also fully reusable in a local setup.

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

## Docker

The application can be easily started using Docker using its [Dockerfile](https://github.com/PSilling/rh-massages/blob/master/dropwizard-api/Dockerfile).
The container needs to be connected to a database to be usable, however.
