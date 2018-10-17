import React from "react";
import ReactDOM from "react-dom";
import "./styles/main/index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import Auth from "./util/Auth";

// The whole application needs to be authenticated with Keycloak adapter before access can be granted.
Auth.keycloak
  .init({ onLoad: "login-required", checkLoginIframe: false })
  .success(authenticated => {
    if (authenticated) {
      // Render the application itself.
      ReactDOM.render(<App />, document.getElementById("root"));
      registerServiceWorker();
    } else {
      /* eslint-disable-next-line no-console */
      console.log("[KEYCLOAK] Authentication has failed!");
    }
  })
  .error(() => {
    /* eslint-disable-next-line no-console */
    console.log("[KEYCLOAK] Failed to initialize Keycloak authentication!");
  });
