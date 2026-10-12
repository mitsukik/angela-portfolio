import type { Locale } from "@/data/locale";
import type { ScrubberState } from "@/components/design-samples/case-final/StateScrubber";
import type { JourneyChapter } from "./Case04Journey";

/*
 * CASE04 evidence V2 — every screen below is a capture of the LABO65 V2
 * prototype (https://labo65-app.vercel.app, 2026-10-12): stills taken through
 * the build's own public screen list (real states, real copy), the journey
 * recorded as one uninterrupted pass in the build's phone mode.
 *
 * Confidentiality (unchanged CASE04 rules): captures REMOVE — never redraw —
 * the brand mark, the monthly-quota badge, chakra / frequency labels (DOM
 * and the generating canvas) and the Home "energy structure" row; generate
 * step 04 (chakra) is not captured and is cut from the recording. No pricing,
 * algorithm or healing-plan content appears.
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
    generating: { src: v2("status-generating"), alt: "Generating screen: the user's choices are drawn into an animated progress ring, with an option to return Home" },
    home: { src: v2("home-ready"), alt: "Home screen with today's soundscape ready to play or generate, brand identity and personalization-mechanism details removed" },
    listening: { src: v2("player-playing"), alt: "Player while a soundscape is playing, with progress, skip, loop, sleep-timer and favourite controls" },
  },
  stepsOverview: { src: v2("guided-steps-overview"), alt: "Six steps of the guided daily flow in a 3 × 2 overview: radar, slider with orb, radial picker, scene cards, nature-sound bubbles and instrument bubbles" },
  stepProgress: {
    profile: { src: v2("profile-step1"), alt: "Profile setup step 1 of 4 (birth date), showing the step-progress indicator" },
    daily: { src: v2("gen1-radar"), alt: "Daily questionnaire step 1, showing the same step-progress indicator" },
  },
  recovery: {
    generating: { src: v2("status-generating"), alt: "Generating today's soundscape with guidance that the user can leave and return" },
    failed: { src: v2("status-gen-fail"), alt: "Generation failed state; the user's questionnaire answers have been preserved, with retry and defer actions" },
    playback: { src: v2("player-error"), alt: "Playback error state; the soundscape and playback progress are preserved, with a retry action" },
  },
  player: { src: v2("player-playing"), alt: "Player for listening to a generated soundscape" },
  history: { src: v2("history"), alt: "Listening history with 7 / 30 / 60-day ranges, stats and per-track download status" },
  journey: { src: "/videos/case04/case04-v2-journey.mp4", poster: v2("journey-poster"), duration: 54.93 },
} as const;

type Item = { name: string; detail: string; protects: string; src: string; alt: string };
const states = (items: Item[]): ScrubberState[] => items.map(({ src, alt, ...s }) => ({ ...s, asset: { src, alt } }));

/** §03 — one Home, six real states (each = a state of Home's hero card in V2). */
export function homeStates(locale: Locale): ScrubberState[] {
  const zh = locale === "zh";
  return states([
    {
      name: zh ? "訪客" : "Guest",
      detail: zh ? "未登入也能先試聽 5 分鐘；首頁同時說明建立帳號後能做什麼。" : "A 5-minute preview works before sign-up, and Home explains what an account adds.",
      protects: zh ? "主要操作：立即試聽" : "Primary action: Listen now",
      src: v2("home-guest"),
      alt: "Guest Home state with a 5-minute preview and a create-account prompt, brand identity removed",
    },
    {
      name: zh ? "尚未開始" : "Not started",
      detail: zh ? "今日聲景已準備好，可以直接播放，或依今天的狀態重新生成。" : "Today's soundscape is ready to play, or the user can generate one for how they feel today.",
      protects: zh ? "主要操作：播放／生成" : "Primary actions: Play / Generate",
      src: v2("home-ready"),
      alt: "Home state with today's soundscape ready, offering Play and Generate, brand identity and personalization-mechanism details removed",
    },
    {
      name: zh ? "生成中" : "Generating",
      detail: zh ? "主卡顯示生成進度；使用者可以離開，完成後會收到通知。" : "The hero card shows generation progress; the user can leave and is notified when it's ready.",
      protects: zh ? "主要操作：查看生成進度" : "Primary action: View progress",
      src: v2("home-generating"),
      alt: "Home state while a soundscape generates in the background, with a progress bar and a note that the user can leave",
    },
    {
      name: zh ? "生成失敗" : "Generation failed",
      detail: zh ? "問卷答案已保留，主卡直接提供再試一次。" : "Questionnaire answers are kept, and the hero card offers a direct retry.",
      protects: zh ? "主要操作：再試一次" : "Primary action: Try again",
      src: v2("home-failed"),
      alt: "Home state after generation failed, stating that answers are preserved, with a Try again action",
    },
    {
      name: zh ? "聆聽中" : "Listening",
      detail: zh ? "播放進度留在首頁，離開播放器後仍可直接暫停或繼續。" : "Playback progress stays on Home, so the user can pause or resume without reopening the player.",
      protects: zh ? "主要操作：暫停／繼續" : "Primary action: Pause / Resume",
      src: v2("home-listening"),
      alt: "Home state while today's soundscape is playing, with playback progress and a pause action",
    },
    {
      name: zh ? "已完成" : "Completed",
      detail: zh ? "今天的聲景已聽完，主卡改為再聽一次。" : "Today's soundscape has been played; the hero card switches to replay.",
      protects: zh ? "主要操作：再聽一次" : "Primary action: Listen again",
      src: v2("home-completed"),
      alt: "Home state after today's soundscape has finished playing, with a Listen again action",
    },
  ]);
}

/** §02 — the input patterns of the guided flow (step 04 withheld). */
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
      detail: zh ? "期望獲得的狀態環繞中心排列，選取時以發光標示，最多 3 項。" : "Desired outcomes orbit a centre point and glow when selected, up to three.",
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

/** §05 — reusable feedback, loading and recovery patterns shared across flows. */
export function systemPatterns(locale: Locale): ScrubberState[] {
  const zh = locale === "zh";
  return states([
    {
      name: zh ? "選取上限回饋" : "Selection-limit feedback",
      detail: zh ? "超過上限時以提示說明原因，而不是讓點擊沒有反應。" : "Going past the limit shows a short message explaining why, instead of a tap that silently does nothing.",
      protects: zh ? "共用：所有多選步驟" : "Shared: every multi-select step",
      src: v2("feedback-limit-toast"),
      alt: "A toast reading 'select up to 3' after a fourth bubble is tapped",
    },
    {
      name: zh ? "底部選單" : "Bottom sheet",
      detail: zh ? "次要選擇（例如為誰生成）放在底部選單，不必離開目前的步驟。" : "Secondary choices, such as who the soundscape is for, open in a bottom sheet without leaving the current step.",
      protects: zh ? "共用：日期、時區、性別、親友" : "Shared: date, time zone, gender, people",
      src: v2("sheet-friends"),
      alt: "A bottom sheet for choosing who to generate for: the user or a saved person",
    },
    {
      name: zh ? "載入中" : "Loading",
      detail: zh ? "網路較慢時明確說明正在載入，完成後自動開始播放。" : "Slow connections get an explicit loading state that starts playback automatically when ready.",
      protects: zh ? "播放器" : "Player",
      src: v2("player-buffering"),
      alt: "Player loading state explaining that slow networks may take a few seconds",
    },
    {
      name: zh ? "網路中斷" : "Connection lost",
      detail: zh ? "網路中斷時保留已輸入的答案，提供再試一次與稍後再試。" : "When the connection drops, answers are kept, with Try again and Later actions.",
      protects: zh ? "共用：生成、註冊" : "Shared: generation, sign-up",
      src: v2("status-gen-offline"),
      alt: "Connection-lost screen stating the questionnaire answers are kept, with retry and later actions",
    },
    {
      name: zh ? "完成回饋" : "Completion feedback",
      detail: zh ? "聽完後以五種感受快速回饋，一次點擊即可完成。" : "After listening, five feelings give one-tap feedback.",
      protects: zh ? "播放器" : "Player",
      src: v2("player-feedback"),
      alt: "Feedback card after listening, with five feeling options and a Done action",
    },
  ]);
}

/** §04 — chapter marks of the recorded journey (seconds, from the recording). */
export function journeyChapters(locale: Locale): JourneyChapter[] {
  const zh = locale === "zh";
  return [
    { t: 0, name: zh ? "首頁／今日" : "Home / Today", detail: zh ? "從今日主卡點選「生成」。" : "Start from Today's hero card and tap Generate." },
    { t: 3.99, name: zh ? "引導式輸入" : "Guided input", detail: zh ? "雷達圖、滑桿、環狀選擇、場景卡片與泡泡；第 4 步未公開，已從錄影中剪除。" : "Radar, slider, radial picker, scene cards and bubbles. Step 04 is withheld and cut from the recording." },
    { t: 22.58, name: zh ? "生成中" : "Generating", detail: zh ? "選擇逐一被吸收進生成動畫，也可以先回到首頁。" : "Each choice is drawn into the generation animation; the user can also go back Home." },
    { t: 31.39, name: zh ? "生成完成" : "Ready", detail: zh ? "結果畫面直接提供「立即聆聽」。" : "The result screen leads straight to Listen now." },
    { t: 34.39, name: zh ? "播放器" : "Player", detail: zh ? "循環、收藏、快轉 10 秒、暫停與繼續。" : "Loop, favourite, skip 10 seconds, pause and resume." },
    { t: 46.73, name: zh ? "返回首頁" : "Back to Home", detail: zh ? "收合播放器後，首頁主卡切換為聆聽中並保留進度。" : "After the player is collapsed, Home's hero card switches to Listening and keeps the progress." },
    { t: 50.32, name: zh ? "聆聽紀錄" : "History", detail: zh ? "從底部導覽進入聆聽紀錄。" : "The bottom navigation opens listening history." },
  ];
}
