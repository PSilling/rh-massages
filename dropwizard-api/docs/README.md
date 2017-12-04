# Swagger-UI

You can view the API Docs in swagger-ui [here](http://petstore.swagger.io/?url=https://raw.githubusercontent.com/PSilling/rh-massages/master/dropwizard-api/docs/swagger.json).
Profile `mvn clean package -Pswagger` can then be run to rescan the JAX-RS resources and update the [swagger.json](https://github.com/PSilling/rh-massages/blob/master/dropwizard-api/docs/swagger.json). file.

# Keycloak example export

You can import exemplary Keycloak settings (realm, clients and also roles) with [keycloak-export.json](https://github.com/PSilling/rh-massages/blob/master/dropwizard-api/docs/keycloak-export.json).
