export interface LicenseUser {
  userId: number;
  username: string;
  name: string;
  clientNo: number;
  email: string;
  licenseStatus: "ACTIVE" | "INACTIVE";
}

export interface LicenseInfo {
  totalLicenseCount: number;
  usedLicenseCount: number;
  teamName: string;
  licenseStatus: "ACTIVE" | "INACTIVE";
  teamUsers: LicenseUser[];
}
