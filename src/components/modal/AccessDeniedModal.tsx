import { useEffect, useState } from "react";
import keycloak from "../../keycloack/keycloak"; // 🛑 დაარეგულირე გზა
// თუ keycloak-ის default export გაქვს, იმპორტი სწორად უნდა ეწეროს

const AccessDeniedModal = () => {
  const [open, setOpen] = useState(false);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<number>;
      setStatusCode(customEvent.detail);
      setOpen(true);
    };

    window.addEventListener("access-forbidden", handler);
    return () => window.removeEventListener("access-forbidden", handler);
  }, []);

  const handleClose = () => {
    setOpen(false);
    keycloak.logout(); // ან keycloak.login();
  };

  if (!open) return null;

  const getMessage = () => {
    switch (statusCode) {
      case 400:
        return "თქვენ არ ხართ ჯგუფში ჩასმული.";
      case 403:
        return "თქვენ არ გაქვთ შესაბამისი უფლება სისტემაში შესასვლელად.";
      default:
        return "წვდომა შეზღუდულია.";
    }
  };

  return (
    <div style={modalStyle}>
      <div style={boxStyle}>
        <h2>⛔</h2>
        <p>{getMessage()}</p>
        <button style={buttonStyle} onClick={handleClose}>
          დაბრუნდი ავტორიზაციაზე
        </button>
      </div>
    </div>
  );
};

// სტილები...

// სტილები
const modalStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const boxStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "8px",
  textAlign: "center",
  maxWidth: "400px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
};

const buttonStyle: React.CSSProperties = {
  marginTop: "1rem",
  padding: "0.5rem 1rem",
  backgroundColor: "#1976d2",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default AccessDeniedModal;
