import AdminModule from "../AdminModule";
export default function Page() {
  return (
    <AdminModule
      title="Careers & Applications"
      description="Review job applications and update candidate statuses. Vacancies are managed in the careers table."
      table="applications"
      columns={[
        { key: "applicant_name", label: "Applicant" },
        { key: "career_title", label: "Role" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "portfolio_url", label: "Portfolio URL" },
        { key: "cover_letter", label: "Cover Letter", truncate: true },
      ]}
      statusField="status"
      statusOptions={["New", "In Review", "Shortlisted", "Rejected", "Hired"]}
    />
  );
}
