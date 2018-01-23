// Auth handler using Keycloak
import Keycloak from 'keycloak-js';

// util imports
import Util from './Util';

/**
 * Keycloak authorization holder. Functions called on Auth work with the Keycloak
 * conncetion variable.
 */
var Auth = function() {};

Auth.keycloak = Keycloak();

/**
 * Register new and update old Clients after Keycloak authorization success.
 */
Auth.keycloak.onAuthSuccess = () => {
  Util.get(Util.CLIENTS_URL + 'my/subscribed', (json) => {
    Auth.subscribed = json;
    Util.put(Util.CLIENTS_URL, Auth.getClient(), () => {
    }, false);
  });
}

Auth.subscribed = true;

Auth.isAuthenticated = () => {
  return Auth.keycloak.authenticated;
}

Auth.isAdmin = () => {
  return Auth.keycloak.hasRealmRole("admin");
}

Auth.getToken = () => {
  return Auth.keycloak.token;
}

Auth.getSub = () => {
  return Auth.keycloak.subject;
}

/**
 * Generates a new Client based on server Client representation.
 */
Auth.getClient = () => {
  return {
    sub: Auth.keycloak.subject, email: Auth.keycloak.idTokenParsed.email,
    name: Auth.keycloak.idTokenParsed.given_name, surname: Auth.keycloak.idTokenParsed.family_name,
    subscribed: Auth.subscribed
  };
}

export default Auth
