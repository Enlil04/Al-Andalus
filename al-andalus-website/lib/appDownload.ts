import { headers } from "next/headers";
import { fetchPagesContent } from "@/lib/cms/content";

export type AppStoreKey = "ios" | "android" | "huawei";

export type AppStoreLinks = {
  ios: string;
  android: string;
  huawei: string;
};

export function getSiteOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:8080"
  );
}

export function getUnifiedDownloadUrl(): string {
  return `${getSiteOrigin()}/download`;
}

export async function getAppStoreLinks(): Promise<AppStoreLinks> {
  const pages = await fetchPagesContent();
  const [ios, android, huawei] = pages.application.downloads;
  return {
    ios: ios?.url ?? "",
    android: android?.url ?? "",
    huawei: huawei?.url ?? "",
  };
}

export function detectStoreFromUserAgent(ua: string): AppStoreKey | "unknown" {
  const value = ua.toLowerCase();

  // Huawei / Honor / HarmonyOS before generic Android
  if (
    value.includes("huawei") ||
    value.includes("honor") ||
    value.includes("harmonyos") ||
    value.includes("hmscore")
  ) {
    return "huawei";
  }

  if (
    value.includes("iphone") ||
    value.includes("ipad") ||
    value.includes("ipod") ||
    (value.includes("mac os") && value.includes("mobile"))
  ) {
    return "ios";
  }

  if (value.includes("android")) {
    return "android";
  }

  return "unknown";
}

export async function resolveDownloadTarget(
  userAgent?: string | null,
): Promise<{ url: string; store: AppStoreKey | "fallback" }> {
  const links = await getAppStoreLinks();
  const store = detectStoreFromUserAgent(userAgent ?? "");

  if (store === "ios" && links.ios) return { url: links.ios, store };
  if (store === "android" && links.android) return { url: links.android, store };
  if (store === "huawei" && links.huawei) return { url: links.huawei, store };

  // Prefer any configured store, then fall back to the application page
  const fallback =
    links.ios || links.android || links.huawei || `${getSiteOrigin()}/application`;

  return { url: fallback, store: "fallback" };
}

export async function resolveDownloadTargetFromRequest(): Promise<{
  url: string;
  store: AppStoreKey | "fallback";
}> {
  const headerList = await headers();
  return resolveDownloadTarget(headerList.get("user-agent"));
}
