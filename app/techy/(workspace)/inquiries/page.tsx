import AdminModule from "../AdminModule";

export default function AdminInquiriesPage() {
  return (
    <AdminModule
      title="Client Inquiries"
      description="All contact-form submissions, categorised by type. Update statuses as you respond."
      table="inquiries"
      columns={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "kind", label: "Type" },
        { key: "subject", label: "Subject" },
        { key: "message", label: "Message", truncate: true },
      ]}
      statusField="status"
      statusOptions={["New", "In Review", "Responded", "Closed"]}
    />
  );
}
