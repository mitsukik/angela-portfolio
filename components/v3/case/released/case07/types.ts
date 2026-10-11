import type { Locale } from '@/data/locale';
type Localized = Record<Locale, string>;
export type LegacyVisualSlot = {
    id: string;
    note: Localized;
    aspect: "wide" | "standard" | "panorama";
};
export type LegacyDecision = {
    title: Localized;
    body: Record<Locale, string[]>;
    slot: LegacyVisualSlot;
    layout: "aside" | "below";
    rationale?: {
        constraint: Localized;
        decision: Localized;
        value: Localized;
    };
};
export type LegacySection = {
    label: Localized;
    heading: Localized;
    body: Record<Locale, string[]>;
    slot?: LegacyVisualSlot;
    decisions?: LegacyDecision[];
    points?: Record<Locale, string[]>;
    pointsStyle?: "outcome" | "outcome-strong";
    rationaleStyle?: "lead";
};
export type LegacyCasePage = {
    number: string;
    theme: "dark" | "light";
    format: "case" | "earlier-work";
    title: Localized;
    zhTitleLines: string[];
    zhTitleWrap?: Record<string, string[]>;
    enTitleLines?: string[];
    eyebrow: Localized;
    headline: Record<Locale, string[]>;
    intro: Localized;
    metadata: Record<Locale, {
        label: string;
        value: string;
    }[]>;
    prototype?: {
        href: string;
        label: Localized;
        note: Localized;
    };
    client?: {
        label: Localized;
        text: Localized;
    };
    disclosure?: {
        label: Localized;
        text: Localized;
    } | null;
    sections: LegacySection[];
};

