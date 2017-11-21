import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Auth from './utils/Auth';

// The whole application needs to be authenticated before access.
Auth.keycloak.init({ onLoad: 'login-required', checkLoginIframe: false }).success(function (authenticated) {
    if (authenticated) {
        console.log('The authentication has been successful!');
        console.log(Auth.keycloak.token);

        ReactDOM.render(<App />, document.getElementById('root'));
        registerServiceWorker();
    } else {
        console.log('The authentication has failed!');
    }
}).error(function () {
    console.log('Failed to initialize Keycloak authentication!');
});
