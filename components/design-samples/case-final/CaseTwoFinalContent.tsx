import Image from "next/image";
import type { ReactNode } from "react";
import type { Locale } from "@/data/locale";
import { Reveal } from "../Reveal";
import { HeroEvidenceReveal } from "./HeroEvidenceReveal";
import { CaseEvidenceViewerProvider, EvidenceTrigger } from "./CaseEvidenceViewer";

type RegisterSection = (index: number, element: HTMLElement | null) => void;

const projects = {
  sdx: {
    name: "Shun De Xing / SDX",
    role: "UX/UI Designer",
    focus: "Information Architecture · Content Hierarchy · Corporate Communication",
    url: "https://sdxdevelop.com/",
  },
  charming: {
    name: "Charming Clinic",
    role: "UX/UI Designer · Frontend Support",
    focus: "Service Discovery · Brand Trust · User Flow",
    url: "https://charmingvip.com/",
  },
  natex: {
    name: "NATEX",
    role: "UX/UI Designer · Frontend",
    focus: "B2B Communication · Technical Content Hierarchy · Responsive Execution",
    url: "https://www.natex.com.tw/",
  },
} as const;

function Section({
  index,
  register,
  children,
  divider = true,
}: {
  index: number;
  register: RegisterSection;
  children: ReactNode;
  divider?: boolean;
}) {
  return (
    <div
      ref={(element) => register(index, element)}
      className={`cf-section min-w-0${divider ? " cf-section-divider" : ""}`}
    >
      {children}
    </div>
  );
}

function SectionHeading({
  label,
  title,
  intro,
}: {
  label: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="max-w-[70ch]">
      <p className="cf-meta cf-section-label cf-accent md:whitespace-nowrap">{label}</p>
      <h2 className="cf-heading cf-h3 mt-4">{title}</h2>
      {intro && <p className="cf-body body-tc mt-8 max-w-[62ch]">{intro}</p>}
    </header>
  );
}

function ProjectMeta({
  name,
  role,
  focus,
  url,
}: {
  name: string;
  role: string;
  focus: string;
  url: string;
}) {
  return (
    <>
      <dl className="mt-8 border-t cf-rule">
        <div className="grid gap-2 border-b cf-rule py-4 sm:grid-cols-[7rem_1fr] sm:gap-5">
          <dt className="cf-meta cf-dim">Project</dt>
          <dd className="cf-heading text-[16px] leading-7">{name}</dd>
        </div>
        <div className="grid gap-2 border-b cf-rule py-4 sm:grid-cols-[7rem_1fr] sm:gap-5">
          <dt className="cf-meta cf-dim">Role</dt>
          <dd className="cf-body text-[15px] leading-7">{role}</dd>
        </div>
        <div className="grid gap-2 border-b cf-rule py-4 sm:grid-cols-[7rem_1fr] sm:gap-5">
          <dt className="cf-meta cf-dim">Focus</dt>
          <dd className="cf-body text-[15px] leading-7">{focus}</dd>
        </div>
      </dl>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="case-link cf-meta cf-dim mt-5 inline-block"
      >
        Visit Website ↗
      </a>
    </>
  );
}

type EvidenceAsset = {
  src: string;
  alt: string;
};

function EvidenceImage({
  asset,
  format = "landscape",
}: {
  asset: EvidenceAsset;
  format?: "landscape" | "portrait" | "crop";
}) {
  const aspect = {
    landscape: "aspect-[16/10]",
    portrait: "aspect-[4/5]",
    crop: "aspect-[4/3]",
  }[format];

  return (
    <div className={`cf-figure-frame relative ${aspect} overflow-hidden bg-white`}>
      <EvidenceTrigger asset={asset}>
        <Image
          src={asset.src}
          alt=""
          fill
          unoptimized
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-contain"
        />
      </EvidenceTrigger>
    </div>
  );
}

function EvidenceComposition({
  primary,
  secondary,
  caption,
  className = "",
}: {
  primary: EvidenceAsset;
  secondary: EvidenceAsset;
  caption: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className="space-y-3">
        <EvidenceImage asset={primary} />
        <div className="ml-auto w-[86%] sm:w-[72%]">
          <EvidenceImage asset={secondary} format="crop" />
        </div>
      </div>
      <figcaption className="cf-figure-caption cf-meta mt-4">
        {caption}
      </figcaption>
    </figure>
  );
}

function DetailEvidence({
  asset,
  caption,
}: {
  asset: EvidenceAsset;
  caption: string;
}) {
  return (
    <figure>
      <EvidenceImage asset={asset} format="crop" />
      <figcaption className="cf-figure-caption cf-meta mt-4">{caption}</figcaption>
    </figure>
  );
}

function ResponsiveEvidence({
  project,
  desktop,
  mobile,
  caption,
}: {
  project: string;
  desktop: EvidenceAsset;
  mobile: EvidenceAsset;
  caption: string;
}) {
  return (
    <article className="border-t cf-rule pt-7">
      <div className="mb-5 flex items-baseline justify-between gap-5">
        <h3 className="cf-heading text-[18px] font-medium">{project}</h3>
        <p className="cf-meta cf-dim">Desktop / Mobile</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_16rem] sm:items-start lg:grid-cols-[minmax(0,1fr)_18rem]">
        <EvidenceImage asset={desktop} />
        <EvidenceImage asset={mobile} format="portrait" />
      </div>
      <p className="cf-figure-caption cf-meta mt-4">{caption}</p>
    </article>
  );
}

export function CaseTwoHeroEvidence() {
  return (
    <figure className="mt-12 md:mt-16">
      <div className="cf-figure-frame relative aspect-[4/5] overflow-hidden bg-black/[0.035] sm:aspect-[16/8]">
        <HeroEvidenceReveal>
          <div className="absolute left-[3%] top-[4%] h-[42%] w-[88%] overflow-hidden border cf-rule bg-white sm:h-[68%] sm:w-[56%]">
            <Image
              src="/images/case02/evidence/sdx-home-desktop.webp"
              alt="Shun De Xing corporate website homepage"
              fill
              priority
              sizes="(min-width: 640px) 48vw, 88vw"
              className="object-cover object-top"
            />
            <span className="cf-meta absolute bottom-3 left-3 bg-white px-2 py-1 text-[#111]">SDX</span>
          </div>
          <div className="absolute right-[3%] top-[31%] h-[35%] w-[76%] overflow-hidden border cf-rule bg-white sm:top-[12%] sm:h-[54%] sm:w-[38%]">
            <Image
              src="/images/case02/evidence/charming-home-desktop.webp"
              alt="Charming Clinic website homepage"
              fill
              priority
              sizes="(min-width: 640px) 34vw, 76vw"
              className="object-cover object-top"
            />
            <span className="cf-meta absolute bottom-3 left-3 bg-white px-2 py-1 text-[#111]">Charming Clinic</span>
          </div>
          <div className="absolute bottom-[4%] left-[8%] h-[35%] w-[84%] overflow-hidden border cf-rule bg-white sm:bottom-[4%] sm:left-auto sm:right-[8%] sm:h-[48%] sm:w-[44%]">
            <Image
              src="/images/case02/evidence/natex-home-desktop.webp"
              alt="NATEX technology company website homepage"
              fill
              priority
              sizes="(min-width: 640px) 40vw, 84vw"
              className="object-cover object-top"
            />
            <span className="cf-meta absolute bottom-3 left-3 bg-white px-2 py-1 text-[#111]">NATEX</span>
          </div>
        </HeroEvidenceReveal>
      </div>
      <figcaption className="cf-figure-caption cf-meta mt-4">
        Three industries, each translated into a distinct information and trust strategy.
      </figcaption>
    </figure>
  );
}

function ProjectStoryHeading({ index, title }: { index: string; title: string }) {
  return (
    <div>
      <p className="cf-meta cf-accent">{index}</p>
      <h3 className="cf-heading mt-4 text-[clamp(1.75rem,3.2vw,3rem)] font-medium leading-[1.08]">
        {title}
      </h3>
    </div>
  );
}

const contributionRows = [
  ["Requirements", "Yes", "Yes", "Yes"],
  ["Information Architecture / Flow", "Yes", "Yes", "Yes"],
  ["UX/UI Design", "Yes", "Yes", "Yes"],
  ["Content Direction", "Yes", "Yes", "Yes"],
  ["Content Production", "No", "No", "No"],
  ["Responsive Design", "Yes", "Yes", "Yes"],
  ["Frontend", "No", "Partial", "Yes"],
] as const;

export function CaseTwoFinalContent({ register, locale }: { register: RegisterSection; locale: Locale }) {
  const zhHant = locale === "zh";
  return (
    <CaseEvidenceViewerProvider>
      <Section index={0} register={register} divider={false}>
        <Reveal>
          <SectionHeading
            label="02 — OVERVIEW"
            title="Three websites. Three different business contexts."
            intro={
              zhHant
                ? "三個專案橫跨企業服務、醫療美容與科技產業。我從商業需求出發，依各自的受眾與溝通目標整理資訊架構、使用流程與介面層級。"
                : "Three projects across corporate services, healthcare, and technology. In each case, I started from the business needs and shaped the information architecture, flow, and interface around the audience and communication goals."
            }
          />
        </Reveal>
        <ul className="mt-12 grid border-t cf-rule md:grid-cols-3">
          {[projects.sdx, projects.charming, projects.natex].map((project, index) => (
            <li
              key={project.name}
              className="border-b cf-rule py-6 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0"
            >
              <p className="cf-meta cf-accent">0{index + 1}</p>
              <p className="cf-heading mt-4 text-[18px] font-medium leading-7">{project.name}</p>
              <p className="cf-dim mt-2 text-[14px] leading-6">{project.role}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section index={1} register={register}>
        <Reveal>
          <SectionHeading
            label="03 — FROM BUSINESS NEEDS TO WEB STRUCTURE"
            title={zhHant ? "不同的業務，需要不同的資訊優先順序" : "Different Businesses, Different Information Priorities"}
            intro={
              zhHant
                ? "我沒有把同一套網站公式套用在三個品牌上，而是先確認使用者需要理解什麼、信任什麼，以及最終要採取什麼行動。"
                : "Rather than applying one website formula to all three brands, I started by identifying what each audience needed to understand, what would earn their confidence, and what action they were ultimately meant to take."
            }
          />
        </Reveal>
        <div className="mt-12 grid border-t cf-rule lg:grid-cols-3">
          {[
            ["SDX", "Understand the business", ["Broad cross-border services", "Clear service structure", "Corporate credibility", "Contact"]],
            ["Charming Clinic", "Discover the right service", ["Treatment needs", "Service information", "Trust", "Booking"]],
            ["NATEX", "Understand technical capability", ["Solutions", "Expertise", "Business credibility", "Inquiry"]],
          ].map(([name, goal, steps], index) => (
            <article
              key={name as string}
              className="border-b cf-rule py-8 lg:border-r lg:px-7 lg:first:pl-0 lg:last:border-r-0"
            >
              <p className="cf-meta cf-accent">0{index + 1} / {name as string}</p>
              <h3 className="cf-heading mt-5 text-[clamp(1.35rem,2vw,1.8rem)] font-medium leading-tight">{goal as string}</h3>
              <ol className="mt-8 space-y-4">
                {(steps as string[]).map((step, stepIndex) => (
                  <li key={step} className="grid grid-cols-[2rem_1fr] items-start gap-3">
                    <span className="cf-meta cf-dim">{String(stepIndex + 1).padStart(2, "0")}</span>
                    <span className="cf-body text-[15px] leading-6">{step}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </Section>

      <Section index={2} register={register}>
        <p className="cf-meta cf-section-label cf-accent md:whitespace-nowrap">04 — PROJECT STORIES</p>
        <div className="mt-10">
        <ProjectStoryHeading index="04A / SDX" title="Organizing a Complex Corporate Offering" />
        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <ProjectMeta {...projects.sdx} />
            <div className="cf-body body-tc mt-8 space-y-4">
              {zhHant ? (
                <>
                  <p>Shun De Xing 的服務橫跨多個業務領域與市場，因此資訊清晰度與結構尤其重要。</p>
                  <p>我直接向客戶釐清需求、定義頁面流程與資訊層級、完成 UX/UI，並與 PM 協調補齊各區塊所需素材，讓廣泛服務更容易理解。</p>
                </>
              ) : (
                <>
                  <p>Shun De Xing&rsquo;s services span multiple business lines and markets, which made how the information was organized especially important.</p>
                  <p>I worked directly with the client to clarify requirements, defined the page flow and information structure, and designed the UI/UX. I also identified where content was missing and coordinated with the PM to fill those gaps, making the broad service offering easier to follow.</p>
                </>
              )}
            </div>
          </div>
          <Reveal className="lg:col-span-7">
            <EvidenceComposition
              primary={{
                src: "/images/case02/evidence/sdx-home-desktop.webp",
                alt: "Shun De Xing homepage showing corporate positioning, navigation, and primary action",
              }}
              secondary={{
                src: "/images/case02/evidence/sdx-services-desktop.webp",
                alt: "Shun De Xing services page showing grouped business services and enterprise landing flow",
              }}
              caption={
                zhHant
                  ? "首頁先建立跨國商務定位；服務頁再將廣泛業務拆成可理解的入口與企業落地流程。"
                  : "The homepage establishes cross-border business positioning; the services page then breaks a wide offering into approachable entry points and an enterprise inquiry flow."
              }
            />
          </Reveal>
        </div>

        <div className="mt-14 border-t cf-rule pt-10 md:mt-16 md:pt-12">
        <ProjectStoryHeading index="04B / CHARMING CLINIC" title="Turning Services into a Clear Customer Journey" />
        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-start">
          <Reveal className="lg:col-span-7">
            <EvidenceComposition
              primary={{
                src: "/images/case02/evidence/charming-home-desktop.webp",
                alt: "Charming Clinic homepage showing clinic environment, brand tone, and primary booking action",
              }}
              secondary={{
                src: "/images/case02/evidence/charming-services-desktop.webp",
                alt: "Charming Clinic services page showing treatment categories and booking access",
              }}
              caption={
                zhHant
                  ? "首頁以診所環境與專業語氣建立信任；服務頁把療程分群，並保留直接預約入口。"
                  : "The homepage uses the clinic environment and a professional tone to put visitors at ease; the services page groups treatments and keeps a direct booking entry point."
              }
            />
          </Reveal>
          <div className="lg:col-span-5">
            <ProjectMeta {...projects.charming} />
            <div className="cf-body body-tc mt-8 space-y-4">
              {zhHant ? (
                <>
                  <p>Charming Clinic 需要把多樣的醫療與美容服務，整理成容易理解、專業且親近的資訊體驗。</p>
                  <p>我直接與客戶確認需求、建立服務探索流程、完成 UX/UI 並支援初期前端，讓使用者從找到療程、理解服務逐步前往預約。</p>
                </>
              ) : (
                <>
                  <p>Charming Clinic needed its many medical and aesthetic services organized into an experience that felt professional, approachable, and easy to follow.</p>
                  <p>I confirmed requirements directly with the client, built the service-discovery flow, designed the UX/UI, and supported the initial frontend build — guiding users from finding a treatment to booking it.</p>
                </>
              )}
            </div>
          </div>
        </div>
        </div>

        <div className="mt-14 border-t cf-rule pt-10 md:mt-16 md:pt-12">
        <ProjectStoryHeading index="04C / NATEX" title="Translating Technical Expertise for Business Users" />
        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-4">
            <ProjectMeta {...projects.natex} />
            <div className="cf-body body-tc mt-8 space-y-4">
              {zhHant ? (
                <>
                  <p>NATEX 涵蓋軟體、IoT、資料與工業服務等技術能力，主要挑戰是呈現技術深度，同時不讓商務受眾難以理解或導航。</p>
                  <p>除內容製作外，我負責需求、資訊架構、UX flow、介面設計、responsive layouts 與 frontend implementation，是 CASE02 中交付範圍最完整的專案。</p>
                </>
              ) : (
                <>
                  <p>NATEX&rsquo;s technical capabilities span software, IoT, data, and industrial services. The main challenge was presenting that depth without losing business audiences in the navigation.</p>
                  <p>Outside of content production, I owned requirements, information architecture, UX flow, interface design, responsive layouts, and frontend implementation — the broadest delivery scope across the three projects.</p>
                </>
              )}
            </div>
          </div>
          <Reveal className="lg:col-span-8">
            <EvidenceComposition
              primary={{
                src: "/images/case02/evidence/natex-services-desktop.webp",
                alt: "NATEX services overview showing technical service categories and content hierarchy",
              }}
              secondary={{
                src: "/images/case02/evidence/natex-showcase-desktop.webp",
                alt: "NATEX solution detail page connecting service categories with an implemented management system",
              }}
              caption={
                zhHant
                  ? "服務總覽先建立技術範圍；方案頁再用實際系統畫面連接能力與應用情境。"
                  : "The services overview sets the technical scope; the solutions page then connects that capability to real system screens and use cases."
              }
            />
          </Reveal>
        </div>
        </div>
        </div>
      </Section>

      <Section index={3} register={register}>
        <Reveal>
          <SectionHeading
            label="05 — ONE PRINCIPLE, DIFFERENT EXPRESSIONS"
            title={zhHant ? "同一個設計原則，依品牌目標形成不同表達" : "Shared Principles, Different Expressions"}
            intro="Rather than applying the same visual formula across projects, each website was shaped around its audience, industry, and communication goals."
          />
        </Reveal>
        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          <article>
            <Reveal>
              <DetailEvidence
                asset={{
                  src: "/images/case02/evidence/sdx-context-desktop.webp",
                  alt: "Shun De Xing page showing multi-country office locations and established business cooperation",
                }}
                caption={
                  zhHant
                    ? "多國據點與長期合作紀錄，具體呈現跨市場的營運規模。"
                    : "Multiple office locations and an established partner history make the cross-market scale of the business concrete."
                }
              />
            </Reveal>
            <h3 className="cf-heading mt-6 text-[20px] font-medium">Clear Structure</h3>
            <p className="cf-body body-tc mt-3">
              {zhHant ? "協助使用者理解廣泛且跨領域的企業服務。" : "Helps users make sense of a broad, cross-industry set of corporate services."}
            </p>
          </article>
          <article>
            <Reveal>
              <DetailEvidence
                asset={{
                  src: "/images/case02/evidence/charming-booking-desktop.webp",
                  alt: "Charming Clinic contact section showing clinic location, opening hours, and booking action",
                }}
                caption={
                  zhHant
                    ? "診所位置、營業資訊與直接預約入口共同支撐信任與行動。"
                    : "Location, hours, and a direct booking link work together to make the next step easy."
                }
              />
            </Reveal>
            <h3 className="cf-heading mt-6 text-[20px] font-medium">Build Trust</h3>
            <p className="cf-body body-tc mt-3">
              {zhHant ? "在服務資訊與安心、專業的品牌感受之間取得平衡。" : "Balances service information with a reassuring, professional brand feel."}
            </p>
          </article>
          <article>
            <Reveal>
              <DetailEvidence
                asset={{
                  src: "/images/case02/evidence/natex-credentials-desktop.webp",
                  alt: "NATEX company section showing expertise, certification, and business credibility",
                }}
                caption={
                  zhHant
                    ? "公司能力、資安認證與合作脈絡建立 B2B 可信度。"
                    : "Company background, security certifications, and partnership history give B2B visitors reason to take the company seriously."
                }
              />
            </Reveal>
            <h3 className="cf-heading mt-6 text-[20px] font-medium">Communicate Expertise</h3>
            <p className="cf-body body-tc mt-3">
              {zhHant ? "呈現技術能力，同時避免讓商務受眾承受過多資訊。" : "Presents technical capability without overwhelming a business audience with detail."}
            </p>
          </article>
        </div>
      </Section>

      <Section index={4} register={register}>
        <Reveal>
          <SectionHeading
            label="06 — DESIGNING BEYOND DESKTOP"
            title={zhHant ? "跨裝置保留正確的資訊順序與行動" : "Designing Beyond Desktop"}
            intro={
              zhHant
                ? "版面不是單純把 desktop 縮小，而是依螢幕尺寸重新安排內容層級、閱讀節奏與主要行動，讓每個品牌在較小畫面上仍能傳達正確資訊。"
                : "These layouts aren’t the desktop version scaled down — content, reading order, and key actions were rearranged for each screen size, so every brand still communicates the right information on a smaller display."
            }
          />
        </Reveal>
        <div className="mt-12 space-y-14">
          <Reveal>
            <ResponsiveEvidence
              project={projects.sdx.name}
              desktop={{ src: "/images/case02/evidence/sdx-service-desktop.webp", alt: "Shun De Xing services page on desktop" }}
              mobile={{ src: "/images/case02/evidence/sdx-service-mobile.webp", alt: "Shun De Xing services page on mobile" }}
              caption={
                zhHant
                  ? "版面調整保留了內容層級與可讀性，適應不同螢幕尺寸。"
                  : "The layout adjusts to different screen sizes while keeping content order and readability intact."
              }
            />
          </Reveal>
          <Reveal>
            <ResponsiveEvidence
              project={projects.charming.name}
              desktop={{ src: "/images/case02/evidence/charming-home-desktop.webp", alt: "Charming Clinic desktop homepage" }}
              mobile={{ src: "/images/case02/evidence/charming-home-mobile.webp", alt: "Charming Clinic mobile homepage" }}
              caption={
                zhHant
                  ? "品牌影像、診所介紹與預約行動在手機上維持清楚的閱讀先後。"
                  : "Brand imagery, the clinic introduction, and the booking action keep the same reading order on mobile."
              }
            />
          </Reveal>
          <Reveal>
            <ResponsiveEvidence
              project={projects.natex.name}
              desktop={{ src: "/images/case02/evidence/natex-home-desktop.webp", alt: "NATEX desktop homepage" }}
              mobile={{ src: "/images/case02/evidence/natex-home-mobile.webp", alt: "NATEX mobile homepage" }}
              caption={
                zhHant
                  ? "版面在手機版重新排列，維持清楚的層級、可讀性與主要操作動線。"
                  : "The layout rearranges for mobile while keeping content order, readability, and the main action path intact."
              }
            />
          </Reveal>
        </div>
      </Section>

      <Section index={5} register={register}>
        <Reveal>
          <SectionHeading
            label="07 — MY ROLE ACROSS THE PROJECTS"
            title={zhHant ? "相同的設計責任，不同的交付範圍" : "My Role Across the Projects"}
          />
        </Reveal>
        <div className="mt-10 w-full min-w-0 max-w-full overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <thead>
              <tr className="border-y cf-rule">
                <th className="cf-meta py-4 pr-6 font-normal">Contribution</th>
                <th className="cf-meta py-4 pr-6 font-normal">SDX</th>
                <th className="cf-meta py-4 pr-6 font-normal">Charming Clinic</th>
                <th className="cf-meta py-4 font-normal">NATEX</th>
              </tr>
            </thead>
            <tbody>
              {contributionRows.map(([contribution, sdx, charming, natex]) => (
                <tr key={contribution} className="border-b cf-rule">
                  <th scope="row" className="cf-heading py-4 pr-6 text-[15px] font-medium">{contribution}</th>
                  {[sdx, charming, natex].map((value, index) => (
                    <td key={`${contribution}-${index}`} className="cf-body py-4 pr-6 text-[15px]">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="cf-dim mt-5 max-w-[62ch] text-[14px] leading-6">
          {zhHant
            ? "Content Direction 指辨識體驗所需資訊，並與 PM 或客戶協調取得內容；文案製作不在我的工作範圍內。"
            : "Content Direction refers to identifying the information required for the experience and coordinating with the PM or client to obtain it. Copy production was not part of my role."}
        </p>
      </Section>

      <Section index={6} register={register}>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal>
              <SectionHeading
                label="08 — REFLECTION"
                title={
                  zhHant
                    ? "Effective web design is not one visual style applied everywhere."
                    : "Effective web design isn’t about applying one visual style everywhere."
                }
              />
            </Reveal>
            <p className="cf-body body-tc mt-8 max-w-[62ch]">
              Across these projects, the design approach changed with the business context — from structuring broad corporate services, to guiding treatment discovery, to communicating technical expertise.
            </p>
          </div>

          <aside className="border-t cf-rule pt-7 lg:col-span-4 lg:mt-0">
            <p className="cf-meta cf-accent">CAPABILITIES</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {["Information Architecture", "Client Communication", "UX/UI Design", "Brand Adaptation", "Responsive Web", "Frontend Execution"].map((item) => (
                <li key={item} className="cf-tag">{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>
    </CaseEvidenceViewerProvider>
  );
}
