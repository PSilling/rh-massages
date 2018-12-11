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

Auth.keycloak = Keycloak({
  realm: process.env.REACT_APP_KC_REALM || "massages",
  url: process.env.REACT_APP_KC_AUTH_URL || "http://localhost:9090/auth",
  "ssl-required": process.env.REACT_APP_KC_SSL_MODE || "none",
  clientId: process.env.REACT_APP_KC_RESOURCE || "ui-client",
  "public-client": process.env.REACT_APP_KC_PUBLIC_CLIENT || true,
  "enable-cors": process.env.REACT_APP_KC_CORS || true
});

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
