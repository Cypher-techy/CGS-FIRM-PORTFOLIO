import AddUser from "./AddUser";
import AdminModule from "../AdminModule";
export default function Page() {
  return (
    <>
      <AddUser />
      <AdminModule
        title="User access"
        description="Manage user access."
        table="profiles"
        columns={[
          { key: "email", label: "Email" },
          { key: "full_name", label: "Full Name" },
          { key: "role", label: "Role" },
        ]}
      />
    </>
  );
}
