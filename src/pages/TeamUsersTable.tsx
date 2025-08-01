import React from "react";
import { useLicenseInfo } from "../hooks/useLicenseInfo";
import Card from "../components/common/Card";
import Table, { type Column } from "../components/table/Table";

interface TeamUserRow {
  clientNo: string;
  name: string;
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
    { header: "კლიენტის #", accessor: "clientNo" },
    { header: "სახელი", accessor: "name" },
    { header: "ლიცენზიის სტატუსი", accessor: "licenseStatus" },
  ];

  const data = licenseInfo.teamUsers.map((user) => ({
    clientNo: user.clientNo != null ? String(user.clientNo) : "",
    name: user.name, // ✅ შეცვლილია username → name
    licenseStatus: user.licenseStatus === "ACTIVE" ? "აქტიური" : "არაქტიური",
  }));

  return (
    <Card className="full-width-card" title="გუნდის წევრები">
      <Table columns={columns} data={data} />
    </Card>
  );
};

export default TeamUsersTable;
