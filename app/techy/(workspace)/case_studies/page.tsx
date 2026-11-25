import AdminModule from "../AdminModule";
export default function Page() {
  return (
    <AdminModule
      title="Case studies"
      description="Manage case studies."
      table="case_studies"
      columns={[
        { key: "title", label: "Title" },
        { key: "project_id", label: "Project Id" },
      ]}
    />
  );
}
