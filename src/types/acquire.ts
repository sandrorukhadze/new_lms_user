export interface AcquireLicensePayload {
  action: "ACQUIRE" | "RELEASE";
}

export interface AcquireLicenseResponse {
  success: boolean;
  message?: string;
}
