import React from "react";
import { useLicenseInfo } from "../hooks/useLicenseInfo";
import { useLicenseInactivityWarning } from "./useLicenseInactivityWarning";
import "./LicenseInactivityModal.css";

type LicenseInfo = {
  actionTime: string | null;
};

const LicenseInactivityModal: React.FC = () => {
  const { data } = useLicenseInfo();

  const actionTime = (data as LicenseInfo | undefined)?.actionTime ?? null;

  const { showWarning, close } = useLicenseInactivityWarning(actionTime, 1);

  if (!showWarning) return null;

  return (
    <div className="license-modal-overlay">
      <div className="license-modal">
        <h3>⚠️ უმოქმედო რეჟიმი</h3>
        <p>თქვენ გამოყენებული გაქვთ ლიცენზია</p>
        <button onClick={close}>დასტური</button>
      </div>
    </div>
  );
};

export default LicenseInactivityModal;
