import React, { useState, useEffect } from "react";
import "./UserInfo.css";

import Card from "../components/common/Card";
import Alert from "../components/common/Alert";
import TeamUsersTable from "./TeamUsersTable";

import { useUserInfo } from "../hooks/useUserInfo";
import { useLicenseInfo } from "../hooks/useLicenseInfo";
import { useAcquireLicense } from "../hooks/useAcquireLicense";
import { useQueryClient } from "@tanstack/react-query";
import { mapErrorMessage } from "../utils/mapErrorMessage";

const UserInfo: React.FC = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useUserInfo();

  const {
    data: licenseInfo,
    isLoading: licenseLoading,
    error: licenseError,
  } = useLicenseInfo();

  const { mutate: acquireLicense, isPending: isSubmitting } =
    useAcquireLicense();

  // Alert state
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  // Auto-dismiss alert after 3 seconds
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleTakeLicense = () => {
    acquireLicense(
      { action: "ACQUIRE" },
      {
        onSuccess: () => {
          setAlertType("success");
          setAlertMessage("ლიცენზია აღებულია");

          queryClient.invalidateQueries({ queryKey: ["licenseInfo"] });
        },
        onError: (err: unknown) => {
          let message = "უცნობი შეცდომა";

          if (err instanceof Error) {
            message = mapErrorMessage(err.message);
          }

          setAlertType("error");
          setAlertMessage(message);
        },
      }
    );
  };

  const handleReturnLicense = () => {
    acquireLicense(
      { action: "RELEASE" },
      {
        onSuccess: () => {
          setAlertType("success");
          setAlertMessage("ლიცენზია დაბრუნებულია");
          queryClient.invalidateQueries({ queryKey: ["licenseInfo"] });
        },
        onError: (err: unknown) => {
          const maybeAxiosError = err as {
            response?: { data?: { message?: string } };
          };

          const message = mapErrorMessage(
            maybeAxiosError.response?.data?.message || "დაფიქსირდა შეცდომა"
          );

          setAlertType("error");
          setAlertMessage(message);
        },
      }
    );
  };

  if (userLoading || licenseLoading) {
    return <Card title="იტვირთება...">მონაცემები იტვირთება</Card>;
  }

  if (userError || licenseError || !user || !licenseInfo) {
    return <Card title="შეცდომა">მონაცემების მიღება ვერ მოხერხდა</Card>;
  }

  return (
    <div className="userinfo-container">
      {/* ✅ Alert – ქვედა მარჯვენა კუთხეში */}
      {alertMessage && <Alert type={alertType} message={alertMessage} />}

      <div className="userinfo-card-wrapper">
        <Card title="ინფორმაცია მომხმარებელზე">
          <div className="userinfo-meta">
            <p>
              <strong>მომხმარებლის სახელი:</strong>{" "}
              <span className="userinfo-bold">{user.username}</span>
            </p>
            <p>
              <strong>მომხმარებლის სტატუსი:</strong>{" "}
              <span className="userinfo-bold">
                {licenseInfo.licenseStatus === "ACTIVE"
                  ? "აქტიური"
                  : "არაქტიური"}
              </span>
            </p>
          </div>

          <div className="license-stats">
            <div className="stat-box primary">
              <p>ლიცენზიების რაოდენობა</p>
              <h3>{licenseInfo.totalLicenseCount}</h3>
            </div>
            <div className="stat-box danger">
              <p>გამოყენებული</p>
              <h3>{licenseInfo.usedLicenseCount}</h3>
            </div>
          </div>

          <div className="userinfo-buttons">
            <button onClick={handleTakeLicense} disabled={isSubmitting}>
              {isSubmitting ? "მიმდინარეობს..." : "ლიცენზიის აღება"}
            </button>
            <button
              onClick={handleReturnLicense}
              className="secondary"
              disabled={isSubmitting}
            >
              ლიცენზიის დაბრუნება
            </button>
          </div>
        </Card>
      </div>

      <div className="userinfo-table-wrapper">
        <TeamUsersTable />
      </div>
    </div>
  );
};

export default UserInfo;
