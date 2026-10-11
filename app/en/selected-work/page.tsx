import { redirect } from "next/navigation";

/** /en/selected-work → EN INDEX in Channels mode (the V3 Work destination). */
export default function SelectedWorkRedirectEn() {
  redirect("/en#selected-work");
}
