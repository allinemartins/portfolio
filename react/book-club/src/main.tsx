import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { keycloak } from "./auth/keycloak";
import { AuthProvider } from "./auth/AuthProvider";
import { ClubProvider } from "./clubs/ClubProvider.tsx";

import "./styles/theme.css";
import "./styles/globals.css";
import "./styles/ui.css";

async function bootstrap() {
  await keycloak.init({
    onLoad: "check-sso",
    pkceMethod: "S256",
  });

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <AuthProvider>
        <ClubProvider>
          <App />
        </ClubProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}

bootstrap();
