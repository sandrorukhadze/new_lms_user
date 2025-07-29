// src/keycloak/KeycloakProvider.tsx
import { type ReactNode } from "react";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";

interface Props {
  children: ReactNode;
}

const KeycloakProvider = ({ children }: Props) => {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: "login-required",
        checkLoginIframe: false,
      }}
      onTokens={(tokens) => {
        console.log("🔐 Token obtained:", tokens?.token);
      }}
    >
      {children}
    </ReactKeycloakProvider>
  );
};

export default KeycloakProvider;
