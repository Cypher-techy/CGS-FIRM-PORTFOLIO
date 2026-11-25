import Careers from "./Careers";
import { collection } from "@/lib/content";
export default async function Page() {
  return <Careers VACANCIES={await collection("VACANCIES")} />;
}

export const metadata = { title: "Careers" };
