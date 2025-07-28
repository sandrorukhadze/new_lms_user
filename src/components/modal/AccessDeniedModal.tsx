import { useEffect, useState } from "react";

const AccessDeniedModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);

    window.addEventListener("access-forbidden", handler);
    return () => window.removeEventListener("access-forbidden", handler);
  }, []);

  if (!open) return null;

  return (
    <div style={modalStyle}>
      <div style={boxStyle}>
        <h2>⛔</h2>
        <p>თქვენ არ გაქვთ შესაბამისი უფლება სისტემაში შესასვლელად.</p>
       
      </div>
    </div>
  );
};

// სუფთა ინლაინ სტილები მაგალითისთვის
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

export default AccessDeniedModal;
