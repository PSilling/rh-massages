import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Auth from './util/Auth';

// The whole application needs to be authenticated with Keycloak adapter before access can be granted.
Auth.keycloak.init({ onLoad: 'login-required', checkLoginIframe: false }).success(function (authenticated) {
  if (authenticated) {
      console.log('[KEYCLOAK] Authentication has been successful!');

      // Render the application itself.
      ReactDOM.render(<App />, document.getElementById('root'));
      registerServiceWorker();
  } else {
      console.log('[KEYCLOAK] Authentication has failed!');
  }
}).error(function () {
  console.log('[KEYCLOAK] Failed to initialize Keycloak authentication!');
});
