// UserInfo.tsx
import React, { useState, useEffect } from "react";
import "./UserInfo.css";
import Card from "../components/common/Card";
import Alert from "../components/common/Alert";
import TeamUsersTable from "./TeamUsersTable";
import { Stack, Typography, Modal, Box, Button } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
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
    refetch: refetchLicense,
  } = useLicenseInfo();

  const { mutate: acquireLicense, isPending: isSubmitting } =
    useAcquireLicense();

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  // 🆕 მოდალის სტეიტი
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);

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
          refetchLicense();

          // window.location.href = "lmsprodapp://";
          window.location.href = "lmsdevapp://";
        },
        onError: (err: unknown) => {
          const maybeAxiosError = err as {
            response?: { data?: { message?: string } };
          };

          const rawMessage = maybeAxiosError.response?.data?.message || "";
          const friendlyMessage = mapErrorMessage(rawMessage);

          // 🆕 თუ კონკრეტული მესიჯია, გამოვაჩინოთ მოდალი
          if (rawMessage.includes("License not available")) {
            setIsLicenseModalOpen(true);
            return;
          }

          setAlertType("error");
          setAlertMessage(friendlyMessage);
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
      {alertMessage && <Alert type={alertType} message={alertMessage} />}

      <div className="userinfo-card-wrapper">
        <Card className="full-width-card">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <AccountCircleIcon sx={{ fontSize: 48, color: "#1976d2" }} />
            <Typography variant="h6">{user.username}</Typography>
          </Stack>

          <hr style={{ marginBottom: 16 }} />

          <div className="userinfo-meta">
            <p>
              <strong>მომხმარებლის სახელი:</strong>{" "}
              <span className="userinfo-bold">{user.firstName}</span>
            </p>
            <p>
              <strong>ლიცენზიის სტატუსი:</strong>{" "}
              <span className="userinfo-bold">
                {licenseInfo.licenseStatus === "ACTIVE"
                  ? "აქტიური"
                  : "არაქტიური"}
              </span>
            </p>
          </div>

          <div className="license-stats">
            <div className="stat-box primary">
              <p>სულ ლიცენზიები: {licenseInfo.totalLicenseCount}</p>
            </div>
            <div className="stat-box danger">
              <p>გამოყენებული: {licenseInfo.usedLicenseCount}</p>
            </div>
          </div>

          <div className="userinfo-buttons">
            <button onClick={handleTakeLicense} disabled={isSubmitting}>
              {isSubmitting
                ? "მიმდინარეობს..."
                : licenseInfo.licenseStatus === "ACTIVE"
                ? "განახლება"
                : "ლიცენზიის აღება"}
            </button>
            <button
              onClick={handleReturnLicense}
              className="secondary"
              disabled={isSubmitting || licenseInfo.licenseStatus !== "ACTIVE"}
            >
              ლიცენზიის დაბრუნება
            </button>
          </div>
        </Card>
      </div>

      <div className="userinfo-table-wrapper">
        <TeamUsersTable />
      </div>

      {/* 🆕 მოდალი ლიცენზიის არქონის შემთხვევაში */}
      <Modal
        open={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: "text.secondary",
              mb: 3,
            }}
          >
            ამჟამად ყველა ლიცენზია გამოყენებულია. გთხოვთ სცადეთ მოგვიანებით.
          </Typography>

          <Button
            onClick={() => setIsLicenseModalOpen(false)}
            variant="contained"
            color="primary"
            sx={{
              mt: 1,
              px: 4,
            }}
          >
            დახურვა
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default UserInfo;
