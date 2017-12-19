import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Auth from './util/Auth';

// The whole application needs to be authenticated before access.
Auth.keycloak.init({ onLoad: 'login-required', checkLoginIframe: false }).success(function (authenticated) {
    if (authenticated) {
        console.log('[KEYCLOAK] The authentication has been successful!');
        ReactDOM.render(<App />, document.getElementById('root'));
        registerServiceWorker();
    } else {
        console.log('[KEYCLOAK] The authentication has failed!');
    }
}).error(function () {
    console.log('[KEYCLOAK] Failed to initialize Keycloak authentication!');
});
