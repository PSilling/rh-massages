/**
 * Utility class for authorization management.
 */

// Auth handler using Keycloak
import Keycloak from "keycloak-js";

// util imports
import Fetch from "./Fetch";
import Util from "./Util";

/**
 * Keycloak authorization holder. Functions called on Auth work with the Keycloak
 * connection variable.
 */
const Auth = function Auth() {};

Auth.keycloak = Keycloak();

/**
 * Register new and update old Clients after Keycloak authorization success.
 */
Auth.keycloak.onAuthSuccess = () => {
  Fetch.get(`${Util.CLIENTS_URL}my/subscribed`, json => {
    Auth.subscribed = json;
    Fetch.put(Util.CLIENTS_URL, Auth.getClient(), () => {}, false);
  });
};

Auth.subscribed = true;

Auth.isAuthenticated = () => Auth.keycloak.authenticated;
Auth.isAdmin = () => Auth.keycloak.hasRealmRole("admin");
Auth.getToken = () => Auth.keycloak.token;
Auth.getSub = () => Auth.keycloak.subject;

/**
 * Generates a new Client based on server Client representation.
 */
Auth.getClient = () => ({
  sub: Auth.keycloak.subject,
  email: Auth.keycloak.idTokenParsed.email,
  name: Auth.keycloak.idTokenParsed.given_name,
  surname: Auth.keycloak.idTokenParsed.family_name,
  subscribed: Auth.subscribed
});

export default Auth;
