import { CopyProvider } from "@/components/CopyContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { settings, copyFor, collection } from "@/lib/content";
import { linksFrom } from "@/lib/links";
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await settings();
  const groups = ["contact", "partnerships", "careers"];
  const clientCopy = Object.fromEntries(
    await Promise.all(
      groups.map(async (group) => [`copy.${group}`, await copyFor(group)]),
    ),
  );
  return (
    <CopyProvider
      value={{
        ...clientCopy,
        contact_email: s.contact_email,
        office_location: s.office_location,
      }}
    >
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:z-[90] focus:bg-white"
        href="#main"
      >
        Skip to content
      </a>
      <Navbar
        extraNav={linksFrom(s.more_navigation)}
        nav={linksFrom(s.navigation)}
      />
      <main id="main">{children}</main>
      <Footer
        description={
          typeof s.footer_description === "string"
            ? s.footer_description
            : undefined
        }
        products={await collection("PRODUCTS")}
        custom={linksFrom(s.footer)}
        social={linksFrom(s.social_links, true)}
        email={typeof s.contact_email === "string" ? s.contact_email : ""}
      />
    </CopyProvider>
  );
}
