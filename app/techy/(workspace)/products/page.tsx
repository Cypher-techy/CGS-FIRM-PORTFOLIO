import AdminModule from "../AdminModule";

export default function AdminProductsPage() {
  return (
    <AdminModule
      title="Products"
      description="Manage CGS proprietary platforms — Cypher Terra, Edvora LMS, Cypher FX, Chalar Farm Inventory — including status and links."
      table="products"
      columns={[
        { key: "name", label: "Product" },
        { key: "category", label: "Category" },
        { key: "status", label: "Status" },
        { key: "url", label: "URL", truncate: true },
      ]}
    />
  );
}
