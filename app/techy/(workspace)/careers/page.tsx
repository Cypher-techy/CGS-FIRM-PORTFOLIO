import AdminModule from "../AdminModule";

export default function AdminCareersPage() {
  return (
    <div className="space-y-12">
      <AdminModule
        title="Vacancies"
        description="Publish and unpublish open roles. Unpublished roles disappear from the public careers page."
        table="careers"
        columns={[
          { key: "title", label: "Role" },
          { key: "type", label: "Type" },
          { key: "location", label: "Location" },
        ]}
      />
    </div>
  );
}
