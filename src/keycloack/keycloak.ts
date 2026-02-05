// src/keycloak/keycloak.ts
import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  // url: "https://keycloak.bsb.ge:9000/",
  url: "https://dev-keycloak.bsb.ge:9000/",
  // url: "https://test-keycloak.bsb.ge:9000/",
  realm: "bb",
  clientId: "lm-user",
});

export default keycloak;
