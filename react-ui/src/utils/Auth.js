// Auth handler using Keycloak
import Util from './Util';
import Keycloak from 'keycloak-js';

var Auth = function() { };

Auth.keycloak = Keycloak();

Auth.isAuthenticated = () => {
  return Auth.keycloak.authenticated;
}

Auth.isAdmin = () => {
  return true;
}

Auth.getToken = () => {
  console.log("Returned token: " + Auth.keycloak.token);
  return Auth.keycloak.token;
}

export default Auth
