import React from "react";
import "./Alert.css";

interface AlertProps {
  type: "success" | "error";
  message: string;
}

const Alert: React.FC<AlertProps> = ({ type, message }) => {
  return (
    <div className="alert-container">
      <div className={`alert alert-${type}`}>{message}</div>
    </div>
  );
};

export default Alert;
