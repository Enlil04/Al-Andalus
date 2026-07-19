import PageShell from "../../components/PageShell";
import PageBanner from "../../components/PageBanner";
import { getLocale } from "@/lib/locale";
import { fetchPagesContent } from "@/lib/cms/content";
import "./Privacy.css";

export async function generateMetadata() {
  const locale = await getLocale();
  return {
    title: locale === "ar" ? "سياسة الخصوصية | شركة الأندلس للتأمين الدولي" : "Privacy Policy | Al-Andalus International Insurance",
    description: locale === "ar"
      ? "سياسة الخصوصية لشركة الأندلس للتأمين الدولي. تعرف على كيفية جمعنا لبياناتك وحمايتها والتعامل معها في العراق."
      : "Privacy Policy of Al-Andalus International Insurance. Learn how we collect, safeguard, and manage your data in Iraq.",
  };
}

const copyEn = {
  bannerTitle: "Privacy Policy",
  bannerSubtitle: "How we protect your data",
  sections: [
    {
      title: "1. Introduction",
      paragraphs: [
        "At Al-Andalus International Insurance, we value your trust and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.",
        "By accessing our website or using our services, you consent to the data practices described in this policy. If you do not agree with the terms of this Privacy Policy, please do not access the site."
      ]
    },
    {
      title: "2. Information We Collect",
      paragraphs: [
        "We collect information that you provide directly to us when you fill out forms, request quotes, apply for jobs, or communicate with us. This may include:"
      ],
      list: [
        "Personal identification details: Name, email address, phone number, and physical mailing address.",
        "Insurance-related details: Vehicle information, property details, medical history, and specific details required to issue quotes and process claims.",
        "Verification files: Images, PDF scans of ID cards, vehicle registration documents, or other media uploaded to our platform."
      ]
    },
    {
      title: "3. How We Use Your Information",
      paragraphs: [
        "We process your personal information based on legitimate business interests, the fulfillment of our contract with you, compliance with legal obligations, and/or your consent. Specifically, we use it to:"
      ],
      list: [
        "Provide, operate, and maintain our insurance services and website.",
        "Process your inquiries, generate insurance quotes, and manage policies.",
        "Provide customer support and respond to your messages and requests.",
        "Verify your identity and confirm the validity of documentation provided.",
        "Comply with legal and regulatory obligations as dictated by Iraqi law and the Iraqi Insurance Diwan."
      ]
    },
    {
      title: "4. Data Sharing & Disclosure",
      paragraphs: [
        "We do not sell, rent, or trade your personal data. We may share your information only in the following scenarios:"
      ],
      list: [
        "With trusted third-party service providers (such as underwriters, medical networks, and claims adjusters) who assist in executing our contract with you.",
        "To comply with law, regulations, or a subpoena from public authorities and law enforcement in Iraq.",
        "To protect and defend the rights, safety, or property of Al-Andalus International Insurance, our users, or the public."
      ]
    },
    {
      title: "5. Security of Your Data",
      paragraphs: [
        "We implement robust technical and organizational security measures designed to protect the security of any personal information we process. Our database is secured, and access is restricted only to authorized personnel.",
        "However, please remember that no electronic transmission over the internet or information storage technology can be guaranteed 100% secure. You are responsible for ensuring that any data you send to us is transmitted securely."
      ]
    },
    {
      title: "6. Data Retention",
      paragraphs: [
        "We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Policy, unless a longer retention period is required or permitted by Iraqi financial and insurance regulations."
      ]
    },
    {
      title: "7. Your Rights",
      paragraphs: [
        "You have the right to request access to the personal information we collect from you, change that information, or request it to be deleted under specific circumstances. To make a request, please contact our support team using the information provided below."
      ]
    },
    {
      title: "8. Contact Us",
      paragraphs: [
        "If you have any questions or feedback regarding this policy, please reach out to us at:"
      ],
      list: [
        "Email: info@alandalus-iq.com",
        "Phone: +964 771 000 6000",
        "Shortcode: 7366"
      ]
    }
  ]
};

const copyAr = {
  bannerTitle: "سياسة الخصوصية",
  bannerSubtitle: "كيفية حماية بياناتك",
  sections: [
    {
      title: "1. المقدمة",
      paragraphs: [
        "في شركة الأندلس للتأمين الدولي، نحن نقدر ثقتكم وملتزمون بحماية بياناتكم الشخصية. توضح سياسة الخصوصية هذه كيفية جمع معلوماتكم، واستخدامها، والكشف عنها، وحمايتها عند زيارة موقعنا الإلكتروني أو استخدام خدماتنا.",
        "باستخدامك لموقعنا أو الاستفادة من خدماتنا، فإنك توافق على ممارسات البيانات الموضحة في هذه السياسة. إذا كنت لا توافق على شروط سياسة الخصوصية هذه، يرجى التوقف عن استخدام الموقع."
      ]
    },
    {
      title: "2. المعلومات التي نجمعها",
      paragraphs: [
        "نحن نجمع المعلومات التي تقدمونها لنا مباشرة عند ملء النماذج، أو طلب تسعيرات التأمين، أو التقدم للوظائف، أو التواصل معنا. قد تشمل هذه البيانات:"
      ],
      list: [
        "بيانات التعريف الشخصية: الاسم، عنوان البريد الإلكتروني، رقم الهاتف، والعنوان البريدي.",
        "تفاصيل طلب التأمين: معلومات السيارة، تفاصيل العقار، التاريخ الطبي، والتفاصيل المحددة المطلوبة لإصدار عروض الأسعار ومعالجة المطالبات.",
        "مستندات التحقق: الصور، أو ملفات الـ PDF الخاصة بالبطاقة الموحدة، أو سنوية السيارة، أو غيرها من الملفات المرفوعة إلى منصتنا."
      ]
    },
    {
      title: "3. كيفية استخدام معلوماتكم",
      paragraphs: [
        "نعالج معلوماتكم الشخصية بناءً على المصالح التجارية المشروعة، وتنفيذ عقدنا معكم، والامتثال للالتزامات القانونية، و/أو موافقتكم. وبشكل خاص، نستخدمها لأجل:"
      ],
      list: [
        "تقديم خدمات التأمين الخاصة بنا، وتشغيلها، وصيانتها وتطوير موقعنا.",
        "معالجة استفساراتكم، وإصدار عروض أسعار التأمين، وإدارة وثائق التأمين.",
        "تقديم خدمة العملاء والدعم والرد على رسائلكم وطلباتكم.",
        "التحقق من هويتكم وصحة المستندات والوثائق المقدمة.",
        "الامتثال للالتزامات القانونية والتنظيمية التي يفرضها القانون العراقي وتعليمات ديوان التأمين."
      ]
    },
    {
      title: "4. مشاركة البيانات والكشف عنها",
      paragraphs: [
        "نحن لا نبيع بياناتكم الشخصية، ولا نؤجرها أو نتاجر بها. قد نشارك معلوماتكم فقط في الحالات التالية:"
      ],
      list: [
        "مع مقدمي الخدمات الموثوقين من الأطراف الخارجية (مثل شركات إعادة التأمين، الشبكات الطبية، ومسؤولي تسوية المطالبات) الذين يساعدون في تنفيذ التزاماتنا التعاقدية معكم.",
        "الامتثال للقوانين، أو اللوائح المعمول بها، أو الاستجابة لطلب استدعاء رسمي من الجهات الحكومية أو سلطات إنفاذ القانون في العراق.",
        "لحماية والدفاع عن حقوق أو سلامة أو ممتلكات شركة الأندلس للتأمين الدولي، أو مستخدمينا، أو عموم الجمهور."
      ]
    },
    {
      title: "5. أمن بياناتكم",
      paragraphs: [
        "نحن نطبق إجراءات أمنية فنية وتنظيمية صارمة مصممة لحماية أمن وسلامة أي معلومات شخصية نقوم بمعالجتها. قاعدة بياناتنا محمية، والوصول إليها مقيد فقط بالموظفين المصرح لهم.",
        "ومع ذلك، يرجى تذكر أنه لا يمكن ضمان أمان نقل البيانات عبر الإنترنت أو تكنولوجيا التخزين الإلكتروني بنسبة 100%. تقع على عاتقكم مسؤولية التأكد من إرسال بياناتكم إلينا بشكل آمن."
      ]
    },
    {
      title: "6. الاحتفاظ بالبيانات",
      paragraphs: [
        "نحتفظ بمعلوماتكم الشخصية فقط للفترة الزمنية اللازمة لتحقيق الأغراض المحددة في سياسة الخصوصية هذه، ما لم تكن هناك حاجة أو سماح بفترة احتفاظ أطول بموجب الأنظمة واللوائح المالية والتأمينية في العراق."
      ]
    },
    {
      title: "7. حقوقكم",
      paragraphs: [
        "لديك الحق في طلب الوصول إلى المعلومات الشخصية التي نجمعها منك، أو تعديلها، أو طلب حذفها تحت ظروف معينة. لتقديم مثل هذا الطلب، يرجى التواصل مع فريق الدعم لدينا عبر معلومات الاتصال أدناه."
      ]
    },
    {
      title: "8. الاتصال بنا",
      paragraphs: [
        "إذا كانت لديكم أي أسئلة أو ملاحظات بخصوص هذه السياسة، يرجى التواصل معنا عبر:"
      ],
      list: [
        "البريد الإلكتروني: info@alandalus-iq.com",
        "رقم الهاتف: 9647710006000+",
        "الرقم المختصر: 7366"
      ]
    }
  ]
};

export default async function PrivacyPolicyPage() {
  const locale = await getLocale();
  const isArabic = locale === "ar";
  const copy = isArabic ? copyAr : copyEn;
  const pages = await fetchPagesContent();
  const cms = pages.privacy;

  const sections: readonly {
    title: string;
    paragraphs: readonly string[];
    list?: readonly string[];
  }[] = cms.sections.length > 0 ? cms.sections : copy.sections;

  return (
    <PageShell>
        <PageBanner
          title={cms.bannerTitle || copy.bannerTitle}
          subtitle={cms.bannerSubtitle || copy.bannerSubtitle}
          showImage={false}
        />

        <main className="privacy-content">
          {sections.map((section) => (
            <section className="privacy-content__section" key={section.title}>
              <h2 className="privacy-content__title">{section.title}</h2>
              {section.paragraphs.map((p, idx) => (
                <p className="privacy-content__text" key={idx}>
                  {p}
                </p>
              ))}
              {section.list && section.list.length > 0 && (
                <ul className="privacy-content__list">
                  {section.list.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </main>
    </PageShell>
  );
}
