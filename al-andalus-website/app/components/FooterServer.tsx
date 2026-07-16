import { fetchSiteSettings } from "@/lib/cms/content";
import Footer from "./Footer";

export default async function FooterServer() {
  const settings = await fetchSiteSettings();
  return <Footer socialLinks={settings.socialLinks} />;
}
