import { fetchSiteSettings } from "@/lib/cms/content";
import Header from "./Header";

export default async function HeaderServer() {
  const settings = await fetchSiteSettings();
  return <Header logoUrl={settings.siteLogo} />;
}
