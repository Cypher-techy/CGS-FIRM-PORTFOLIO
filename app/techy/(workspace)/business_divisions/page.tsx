import AdminModule from "../AdminModule";
export default function Page() {
  return (
    <AdminModule
      title="Business divisions"
      description="Manage business divisions."
      table="business_divisions"
      columns={[
        { key: "name", label: "Name" },
        { key: "slug", label: "Slug" },
      ]}
    />
  );
}
