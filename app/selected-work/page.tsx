import { redirect } from "next/navigation";

/** /selected-work → INDEX in Channels mode (the V3 Work destination). */
export default function SelectedWorkRedirect() {
  redirect("/#selected-work");
}
