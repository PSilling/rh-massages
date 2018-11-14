// react imports
import React from "react";
import ReactDOM from "react-dom";

// component imports
import App from "./App";
import "./styles/main/index.css";

// util imports
import Auth from "./util/Auth";
import registerServiceWorker from "./registerServiceWorker";

// The whole application needs to be authenticated with Keycloak adapter before access can be granted.
Auth.keycloak
  .init({ onLoad: "login-required", checkLoginIframe: false })
  .success(authenticated => {
    if (authenticated) {
      // Render the application itself.
      ReactDOM.render(<App />, document.getElementById("root"));
      registerServiceWorker();
    } else {
      console.error("Authentication has failed!"); /* eslint-disable-line */
    }
  })
  .error(() => {
    console.log("Failed to initialize Keycloak authentication!"); /* eslint-disable-line */
  });
