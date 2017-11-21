// Auth handler using Keycloak
import Util from './Util';
import Keycloak from 'keycloak-js';

var Auth = function() { };

Auth.keycloak = Keycloak();

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
  return Auth.keycloak.idTokenParsed.sub;
}

export default Auth
