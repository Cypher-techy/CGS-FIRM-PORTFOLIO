import AdminModule from "../AdminModule";

export default function AdminProjectsPage() {
  return (
    <AdminModule
      title="Projects & Case Studies"
      description="Manage the client portfolio. Feature selected projects for the homepage and keep ownership classifications accurate."
      table="projects"
      columns={[
        { key: "name", label: "Project" },
        { key: "client", label: "Client" },
        { key: "category", label: "Category" },
        { key: "ownership", label: "Ownership" },
        { key: "featured", label: "Featured" },
      ]}
    />
  );
}
