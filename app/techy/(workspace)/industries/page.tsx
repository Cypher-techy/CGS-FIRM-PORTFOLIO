import AdminModule from "../AdminModule";
export default function Page() {
  return (
    <AdminModule
      title="Industries served"
      description="Manage industries served."
      table="industries"
      columns={[
        { key: "name", label: "Name" },
        { key: "description", label: "Description" },
      ]}
    />
  );
}
