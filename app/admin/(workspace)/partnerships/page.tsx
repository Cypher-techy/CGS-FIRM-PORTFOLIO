import AdminModule from "../AdminModule";

export default function AdminPartnershipsPage() {
  return (
    <AdminModule
      title="Partnership Inquiries"
      description="Partnership proposals submitted through the partnerships page. Review and update statuses."
      table="partnerships"
      columns={[
        { key: "organisation", label: "Organisation" },
        { key: "contact_name", label: "Contact" },
        { key: "email", label: "Email" },
        { key: "partnership_type", label: "Type" },
        { key: "proposal", label: "Proposal", truncate: true },
      ]}
      statusField="status"
      statusOptions={["New", "In Review", "Responded", "Closed"]}
    />
  );
}
