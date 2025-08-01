import React from "react";
import "./Card.css";

type CardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string; // ✅ დაამატე ეს
};

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>
      <div className="card-content">{children}</div>
    </div>
  );
};

export default Card;
