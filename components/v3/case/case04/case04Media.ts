import type { Locale } from "@/data/locale";
import type { ScrubberState } from "@/components/design-samples/case-final/StateScrubber";
import type { JourneyChapter } from "./Case04Journey";

/*
 * CASE04 evidence V2 — every screen below is a capture of the LABO65 V2
 * prototype (https://labo65-app.vercel.app, 2026-10-12): stills taken through
 * the build's own public screen list (real states, real copy), the journey
 * recorded as one uninterrupted pass in the build's phone mode.
 *
 * Disclosure (Angela, 2026-10-12): the LABO65 name and logo, the employer
 * name, Five-Element (五行) content, chakra (脈輪) screens, Hz values and the
 * monthly generation-quota badge are approved for public display, so every
 * capture shows the V2 UI unaltered (the only overlay is the recording's tap
 * indicator). That approval is an allowlist: no private business data,
 * internal documents, customer data or credentials appear in any capture.
 * The earlier masked captures (commit b8f2743) are archived outside the repo
 * (private-archive/case04-v2-masked-b8f2743, SHA256SUMS.txt).
 *
 * The V1 screenshots this replaces are archived outside the repo
 * (private-archive/case04-v1-media-20261012, SHA256SUMS.txt) and in Git.
 */

const IMG = "/images/case04";
const v2 = (name: string) => `${IMG}/case04-v2-${name}.webp`;

/** Captured stills are 1260 × 2700 (3× device incl. bezel); the recording is 640 × 1350. */
export const CASE04_V2_ASPECT = "1260 / 2700";

export const CASE04_V2 = {
  hero: {
    generating: { src: v2("status-generating"), alt: "LABO65 generating screen: the user's choices, including the Heart chakra 639 Hz frequency, are drawn into an animated progress ring, with an option to return Home" },
    home: { src: v2("home-ready"), alt: "LABO65 Home with today's soundscape ready to play or generate, the 3/3 monthly generation quota and the energy-structure (Five-Element) row" },
    listening: { src: v2("player-playing"), alt: "LABO65 player while a soundscape is playing, showing the scene, Heart chakra 639 Hz and length chips with progress, skip, loop, sleep-timer and favourite controls" },
  },
  journey: { src: "/videos/case04/case04-v2-journey.mp4", poster: v2("journey-poster"), duration: 62.27 },
} as const;

type Item = { name: string; detail: string; protects: string; src: string; alt: string };
const states = (items: Item[]): ScrubberState[] => items.map(({ src, alt, ...s }) => ({ ...s, asset: { src, alt } }));

/** Decision B — one Home, six real states (each = a state of Home's hero card in V2). */
export function homeStates(locale: Locale): ScrubberState[] {
  const zh = locale === "zh";
  return states([
    {
      name: zh ? "訪客" : "Guest",
      detail: zh ? "未登入也能先試聽 5 分鐘；首頁同時說明建立帳號後能做什麼。" : "A 5-minute preview works before sign-up, and Home explains what an account adds.",
      protects: zh ? "主要操作：立即試聽" : "Primary action: Listen now",
      src: v2("home-guest"),
      alt: "LABO65 guest Home with a 5-minute preview tagged Wood (木), relax and bedtime, and a create-account prompt",
    },
    {
      name: zh ? "尚未開始" : "Not started",
      detail: zh ? "今日聲景已準備好，可以直接播放，或依今天的狀態重新生成。" : "Today's soundscape is ready to play, or the user can generate one for how they feel today.",
      protects: zh ? "主要操作：播放／生成" : "Primary actions: Play / Generate",
      src: v2("home-ready"),
      alt: "LABO65 Home with today's soundscape ready, offering Play and Generate, the 3/3 monthly generation quota and the energy-structure row",
    },
    {
      name: zh ? "生成中" : "Generating",
      detail: zh ? "主卡顯示生成進度；使用者可以離開，完成後會收到通知。" : "The hero card shows generation progress; the user can leave and is notified when it's ready.",
      protects: zh ? "主要操作：查看生成進度" : "Primary action: View progress",
      src: v2("home-generating"),
      alt: "LABO65 Home while a soundscape generates in the background, with a progress bar, the 3/3 quota and a note that the user can leave",
    },
    {
      name: zh ? "生成失敗" : "Generation failed",
      detail: zh ? "問卷答案已保留，主卡直接提供再試一次。" : "Questionnaire answers are kept, and the hero card offers a direct retry.",
      protects: zh ? "主要操作：再試一次" : "Primary action: Try again",
      src: v2("home-failed"),
      alt: "LABO65 Home after generation failed, stating that answers are preserved, with a Try again action",
    },
    {
      name: zh ? "聆聽中" : "Listening",
      detail: zh ? "播放進度留在首頁，離開播放器後仍可直接暫停或繼續。" : "Playback progress stays on Home, so the user can pause or resume without reopening the player.",
      protects: zh ? "主要操作：暫停／繼續" : "Primary action: Pause / Resume",
      src: v2("home-listening"),
      alt: "LABO65 Home while today's soundscape is playing, with playback progress and a pause action",
    },
    {
      name: zh ? "已完成" : "Completed",
      detail: zh ? "今天的聲景已聽完，主卡改為再聽一次。" : "Today's soundscape has been played; the hero card switches to replay.",
      protects: zh ? "主要操作：再聽一次" : "Primary action: Listen again",
      src: v2("home-completed"),
      alt: "LABO65 Home after today's soundscape has finished playing, with a Listen again action and 1/3 generations left this month",
    },
  ]);
}

/** Decision A — the input patterns of the guided flow (step 04 is a derived result, shown in the Decision C recording). */
export function inputPatterns(locale: Locale): ScrubberState[] {
  const zh = locale === "zh";
  const step = (n: string) => (zh ? `第 ${n} 步／共 7 步` : `Step ${n} of 7`);
  return states([
    {
      name: zh ? "雷達圖・點擊切換強度" : "Radar · tap to set intensity",
      detail: zh ? "五個面向排成雷達圖，點擊即可在低、中、高之間切換，最多選擇 3 項。" : "Five areas sit on a radar chart; tapping cycles each between low, medium and high, up to three.",
      protects: step("1"),
      src: v2("gen1-radar"),
      alt: "Guided step 1: a five-axis radar chart where tapping an area sets low, medium or high",
    },
    {
      name: zh ? "滑桿＋視覺狀態指示" : "Slider + visual state indicator",
      detail: zh ? "拖動滑桿時，光球顏色即時由藍轉金，再以選項補充更具體的感受。" : "Dragging the slider shifts the orb from blue to gold in real time; chips then add more specific feelings.",
      protects: step("2"),
      src: v2("gen2-feel"),
      alt: "Guided step 2: an orb above a slider for overall feeling, plus specific feeling chips",
    },
    {
      name: zh ? "環狀選擇" : "Radial selection",
      detail: zh ? "期望獲得的狀態環繞中心排列，選取時以發光標示，最多 3 項；第一個選擇決定第 4 步對應的脈輪與頻率。" : "Desired outcomes orbit a centre point and glow when selected, up to three; the first choice sets the chakra and frequency shown in step 4.",
      protects: step("3"),
      src: v2("gen3-wish"),
      alt: "Guided step 3: a radial constellation picker for desired outcomes, two selected",
    },
    {
      name: zh ? "場景卡片" : "Scene cards",
      detail: zh ? "可左右滑動的場景卡片，置中的卡片就是選擇，一次只選一個。" : "A swipeable card carousel; the centred card is the choice, one at a time.",
      protects: step("5"),
      src: v2("gen5-scene"),
      alt: "Guided step 5: a swipeable image-card carousel for choosing a listening scene",
    },
    {
      name: zh ? "泡泡選擇・可略過" : "Bubbles · optional",
      detail: zh ? "自然聲與樂器以漂浮泡泡呈現，可選 0 至 3 項，不需要時直接前往下一步。" : "Nature sounds and instruments float as bubbles; zero to three can be picked, or the step skipped.",
      protects: zh ? "第 6–7 步／共 7 步" : "Steps 6–7 of 7",
      src: v2("gen6-nature"),
      alt: "Guided step 6: floating bubbles for nature sounds, three selected",
    },
  ]);
}

/** Decision C — chapter marks of the recorded journey (seconds: the recording's own step marks + 0.4 s, so a seek lands after the screen transition). */
export function journeyChapters(locale: Locale): JourneyChapter[] {
  const zh = locale === "zh";
  // Six navigational groups over the same uncut recording (2026-10-12); Step 4 keeps its own entry.
  return [
    { t: 0, name: zh ? "首頁／今日" : "Home / Today", detail: zh ? "從今日主卡點選「生成」；主卡依目前狀態提供下一步。" : "Start from Today's hero card, which offers the next step for the current state, and tap Generate." },
    { t: 4.4, name: zh ? "第 1–3 步・感受與心願" : "Steps 1–3 · Feelings and wishes", detail: zh ? "雷達圖、滑桿與光球、環狀選擇：每步只問一件事，並顯示 1/7 起的進度。" : "Radar chart, slider with orb, radial picker: one question per step, with progress shown from 1/7." },
    { t: 14.18, name: zh ? "第 4 步・今天的脈輪" : "Step 4 · Today's chakra", detail: zh ? "依前 3 題得出心輪 639 Hz；點選頂輪預覽說明，再回到今天的結果。" : "The first three answers lead to Heart, 639 Hz; Crown is previewed, then today's result is kept." },
    { t: 20.74, name: zh ? "第 5–7 步・場景與聲音" : "Steps 5–7 · Scene and sounds", detail: zh ? "場景卡片，以及可略過的自然聲與樂器泡泡；最後一步直接生成專屬聲景。" : "Scene cards, then skippable nature-sound and instrument bubbles; the last step generates the soundscape directly." },
    { t: 30.34, name: zh ? "生成與結果" : "Generating & result", detail: zh ? "選擇與頻率被吸收進生成動畫；可以先回到首頁，完成後直接「立即聆聽」。" : "Choices and the frequency are drawn into the generation animation; the user can go back Home, then Listen now when it's ready." },
    { t: 42.14, name: zh ? "聆聽、返回與紀錄" : "Listen, return & history", detail: zh ? "播放控制；收合後首頁切換為聆聽中並保留進度（額度 2/3），再從底部導覽進入聆聽紀錄。" : "Playback controls; after collapsing, Home switches to Listening and keeps progress (quota 2/3), then the bottom navigation opens history." },
  ];
}
