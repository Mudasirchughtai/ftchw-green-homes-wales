import { redirect } from "next/navigation";

// CLAUDE.md -> "RECOMMENDED PAGE URL": /green-homes-wales is the canonical
// landing page. Root just forwards there.
export default function RootPage() {
  redirect("/green-homes-wales");
}
