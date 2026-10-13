import type { Locale } from "@/data/locale";
import type { CaseNo } from "@/data/v3/channel-routes";
import { Case03Page } from "./case03/Case03Page";
import { CaseOriginalPage } from "./legacy/CaseOriginalPage";
import { PrivateCasePage } from "./released/PrivateCasePage";

/** One public CASE page for /work/ch-NN and /en/work/ch-NN — picks the existing page component by CASE number. */
export function CasePublicPage({ caseNo, locale }: { caseNo: CaseNo; locale: Locale }) {
  switch (caseNo) {
    case "03":
      return <Case03Page locale={locale} />;
    case "05":
    case "06":
    case "07":
      return <PrivateCasePage caseNo={caseNo} locale={locale} />;
    default:
      return <CaseOriginalPage caseNo={caseNo} locale={locale} />;
  }
}
