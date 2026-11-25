import AdminModule from "../AdminModule";

export default function AdminServicesPage() {
  return (
    <AdminModule
      title="Services"
      description="Publish, unpublish and review professional services. Public pages read from this table when Supabase is connected."
      table="services"
      columns={[
        { key: "title", label: "Service" },
        { key: "division_name", label: "Division" },
        { key: "summary", label: "Summary", truncate: true },
      ]}
    />
  );
}
