import AppRouter from "./routes/AppRouter";
import { useKeycloak } from "@react-keycloak/web";

const App = () => {
  const { initialized, keycloak } = useKeycloak();

  // სანამ Keycloak არ ინიციალიზდება, დავაბრუნოთ ლოდინის მარკერი
  if (!initialized) {
    return <div>🔐 Loading authentication...</div>;
  }

  // თუ ტოკენი არ გვაქვს, ჯერ ნუ გავუშვებთ AppRouter-ს
  if (!keycloak?.token) {
    return <div>🚫 No token, waiting for authentication...</div>;
  }

  return <AppRouter />;
};

export default App;
