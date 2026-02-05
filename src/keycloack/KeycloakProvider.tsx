// src/keycloak/KeycloakProvider.tsx
import { type ReactNode, type FC } from "react";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";

interface KeycloakProviderProps {
  children: ReactNode;
}

const KeycloakProvider: FC<KeycloakProviderProps> = ({ children }) => {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: "login-required",
        checkLoginIframe: false,
      }}
      onTokens={(tokens) => {
        if (tokens?.token) {
          // აქ შეგიძლია tokens.accessToken ან refreshToken დააიმედო
          // console.log("🔐 Token obtained:", tokens.token);
        }
      }}
    >
      {children}
    </ReactKeycloakProvider>
  );
};

export default KeycloakProvider;
