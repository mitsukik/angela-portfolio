import type { Metadata } from "next";
import { IndexV3Page } from "@/components/v3/index/IndexV3Page";
import { v3ChannelMax, v3Channels } from "@/data/v3/channels";
import { createPageMetadata } from "@/data/site-seo";

export const metadata: Metadata = createPageMetadata("home", "zh");

export default function Home() {
  return (
    <div id="top">
      <IndexV3Page locale="zh" channels={v3Channels("zh")} chMax={v3ChannelMax()} />
    </div>
  );
}
