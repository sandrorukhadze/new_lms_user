import React from "react";
import { useLicenseInfo } from "../hooks/useLicenseInfo";
import Card from "../components/common/Card";
import Table, { type Column } from "../components/table/Table";

interface TeamUserRow {
  username: string;
  licenseStatus: string;
}

const TeamUsersTable: React.FC = () => {
  const { data: licenseInfo, isLoading, error } = useLicenseInfo();

  if (isLoading) {
    return <Card title="იტვირთება...">მონაცემები იტვირთება</Card>;
  }

  if (error || !licenseInfo) {
    return <Card title="შეცდომა">მონაცემების მიღება ვერ მოხერხდა</Card>;
  }

  const columns: Column<TeamUserRow>[] = [
    { header: "მომხმარებელი", accessor: "username" },
    { header: "სტატუსი", accessor: "licenseStatus" },
  ];

  const data = licenseInfo.teamUsers.map((user) => ({
    username: user.username,
    licenseStatus: user.licenseStatus === "ACTIVE" ? "აქტიური" : "არაქტიური",
  }));

  return (
    <Card title={`ჯგუფის სახელი: ${licenseInfo.teamName}`}>
      <Table columns={columns} data={data} />
    </Card>
  );
};

export default TeamUsersTable;
