import AdminModule from "../AdminModule";

export default function AdminPublicationsPage() {
  return (
    <AdminModule
      title="Publications & Insights"
      description="Manage news, articles, research reports and insights — including featured placement and downloadable flags."
      table="publications"
      columns={[
        { key: "title", label: "Title", truncate: true },
        { key: "type", label: "Type" },
        { key: "category", label: "Category" },
        { key: "featured", label: "Featured" },
      ]}
      orderBy="published_at"
    />
  );
}
