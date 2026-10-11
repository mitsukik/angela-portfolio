import type { Metadata } from "next";
import { IndexV3Page } from "@/components/v3/index/IndexV3Page";
import { v3ChannelMax, v3Channels } from "@/data/v3/channels";
import { createPageMetadata } from "@/data/site-seo";

export const metadata: Metadata = createPageMetadata("home", "en");

export default function HomeEn() {
  return (
    <div id="top">
      <IndexV3Page locale="en" channels={v3Channels("en")} chMax={v3ChannelMax()} />
    </div>
  );
}
