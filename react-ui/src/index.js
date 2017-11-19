import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Auth from './utils/Auth';

Auth.keycloak.init({ onLoad: 'login-required' }).success(function (authenticated) {
    if(authenticated) {
        console.log('The authentication has been successful, welcome back, ' + Auth.keycloak.idTokenParsed.name + '!');

        ReactDOM.render(<App />, document.getElementById('root'));
        registerServiceWorker();
    } else {
        console.log('The authentication has failed!');
    }
}).error(function () {
    console.log('Failed to initialize Keycloak authentication!');
});
