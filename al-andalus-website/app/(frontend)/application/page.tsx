import PageShell from "../../components/PageShell";
import ApplicationSection from "../../components/ApplicationSection";
import { getLocale } from "@/lib/locale";

export async function generateMetadata() {
  const locale = await getLocale();
  const title =
    locale === "ar"
      ? "التطبيق | شركة الأندلس للتأمين الدولي"
      : "Application | Al-Andalus Insurance International";
  const description =
    locale === "ar"
      ? "حمّل تطبيق الأندلس للتأمين — أول منصة لتأمين السيارات في العراق. أدر وثائقك ومطالباتك من هاتفك."
      : "Download the Al-Andalus Insurance app — the first motor insurance platform in Iraq. Manage your policies and claims from your phone.";

  return { title, description };
}

export default async function ApplicationPage() {
  return (
    <PageShell>
      <ApplicationSection />
    </PageShell>
  );
}


