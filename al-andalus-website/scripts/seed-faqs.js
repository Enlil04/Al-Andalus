/**
 * Seed FAQ entries (EN + AR) into Payload SQLite.
 * Sources: content.txt + lib/copy faq items.
 */
const { spawnSync } = require("child_process");
const path = require("path");

const dbPath = path.join(__dirname, "..", "database.db");

function q(s) {
  return "'" + String(s).replace(/'/g, "''") + "'";
}

function runBatch(sqlText) {
  const result = spawnSync("sqlite3", [dbPath], {
    input: sqlText,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(result.stderr || "sqlite batch failed");
  }
  return (result.stdout || "").trim();
}

function lexicalAnswer(text, rtl = false) {
  return JSON.stringify({
    root: {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", text, version: 1 }],
          direction: rtl ? "rtl" : "ltr",
          format: "",
          indent: 0,
          version: 1,
        },
      ],
      direction: rtl ? "rtl" : "ltr",
      format: "",
      indent: 0,
      version: 1,
    },
  });
}

const faqs = [
  {
    order: 1,
    questionEn: "What is the purpose of group and individual health insurance?",
    questionAr: "ما هو الغرض من التأمين الصحي الجماعي والفردي؟",
    answerEn:
      "Group and individual health insurance is designed to cover major surgical procedures, including laparoscopic surgeries performed under general anesthesia. The policy covers eligible medical expenses during treatment: hospitalization costs, surgeons' and physicians' fees, companion accommodation where applicable, medical examinations, medications, laboratory tests, and diagnostic imaging services.",
    answerAr:
      "الغرض من هذا التأمين هو تغطية تكاليف العمليات الجراحية الكبرى وجراحة الناظور التي تُجرى تحت التخدير العام. وتغطي الوثيقة النفقات الطبية المؤهلة أثناء العلاج: تكاليف الإقامة بالمستشفى، أجور الجراحين والأطباء، إقامة الشخص المرافق للمريض عند الاقتضاء، الفحوصات الطبية، الأدوية، التحاليل المخبرية، والخدمات التشخيصية بالتصوير والأشعة.",
  },
  {
    order: 2,
    questionEn: "What does fire and burglary insurance for commercial shops cover?",
    questionAr: "ماذا يشمل تأمين الحريق والسرقة للمحلات التجارية؟",
    answerEn:
      "This policy covers losses and damages from fire caused by electrical short circuits, accidental negligence, or fires originating in neighboring premises that spread to the insured property. Burglary and theft coverage can be added upon the insured's request, subject to payment of the applicable additional premium for the selected risks.",
    answerAr:
      "تغطي هذه الوثيقة الخسائر والأضرار الناتجة عن الحريق الناجم عن تماس كهربائي، أو الإهمال العرضي غير المتعمد، أو الحرائق التي تنشأ في المباني المجاورة وتنتشر للمحل المؤمن عليه. ويمكن إضافة تغطية السرقة والسطو بناءً على طلب المؤمن له وخاضعة لقسط إضافي محدد للمخاطر المختارة.",
  },
  {
    order: 3,
    questionEn: "What does individual and group personal accident insurance cover?",
    questionAr: "ما الذي يغطيه تأمين الحوادث الشخصية الفردي والجماعي؟",
    answerEn:
      "Personal accident insurance covers accidental events that result in bodily injury, permanent disability, or accidental death. Coverage applies only to accidents — it does not extend to death or disability from natural causes, illness, or pre-existing medical conditions.",
    answerAr:
      "يغطي تأمين الحوادث الشخصية الأحداث العرضية المفاجئة التي تؤدي إلى إصابة بدنية، أو عجز كلي دائم، أو الوفاة الناتجة عن حادث فقط. وتقتصر التغطية على الحوادث العرضية ولا تشمل الوفاة أو العجز الناتجين عن أسباب طبيعية أو مرض أو حالة صحية سابقة.",
  },
  {
    order: 4,
    questionEn: "Is Al-Andalus a licensed insurance company?",
    questionAr: "هل شركة الأندلس شركة تأمين مرخصة؟",
    answerEn:
      "Yes. Al-Andalus International Insurance holds License No. 38/2018 from the Insurance Diwan of the Iraqi Ministry of Finance, issued on 31 July 2018, under the Insurance Business Regulation Law No. 10 of 2005.",
    answerAr:
      "نعم. تحمل شركة الأندلس للتأمين الدولي إجازة ممارسة أعمال التأمين رقم 38/2018 الصادرة عن ديوان التأمين بوزارة المالية العراقية في 31 تموز 2018، وتعمل بموجب قانون تنظيم أعمال التأمين رقم 10 لسنة 2005.",
  },
  {
    order: 5,
    questionEn: "Where are your branches?",
    questionAr: "أين تقع فروعكم؟",
    answerEn:
      "We operate from three locations: Baghdad (main headquarters), Basrah, and Erbil.",
    answerAr:
      "نعمل من ثلاثة فروع رئيسية: المقر الرئيسي في بغداد، وفرع البصرة، وفرع أربيل.",
  },
  {
    order: 6,
    questionEn: "Which services are still under development?",
    questionAr: "ما هي الخدمات التي لا تزال قيد التطوير؟",
    answerEn:
      "Bankers Blanket Insurance, Loan Protection Insurance, and Cyber Insurance are currently under development. Contact us for updates on availability.",
    answerAr:
      "تأمين المصرف الشامل (Bankers Blanket)، تأمين حماية القروض، والتأمين ضد المخاطر السيبرانية هي حالياً قيد التطوير. يرجى التواصل معنا لمعرفة المستجدات وتوافرها.",
  },
  {
    order: 7,
    questionEn: "How do I get a quote?",
    questionAr: "كيف يمكنني الحصول على عرض أسعار؟",
    answerEn:
      "Call our short number 7366, reach us at +964 771 000 6000, email info@alandalus-iq.com, message us on WhatsApp, or visit any branch.",
    answerAr:
      "يمكنك الاتصال برقمنا المختصر 7366، أو التواصل عبر الهاتف 9647710006000+، أو البريد الإلكتروني info@alandalus-iq.com، أو مراسلتنا عبر واتساب، أو زيارة أي من فروعنا.",
  },
];

const now = new Date().toISOString();
let batch = "BEGIN;\nDELETE FROM faqs_locales;\nDELETE FROM faqs;\n";

for (const faq of faqs) {
  batch += `INSERT INTO faqs ("order", updated_at, created_at) VALUES (${faq.order}, ${q(now)}, ${q(now)});\n`;
  batch += `INSERT INTO faqs_locales (question, answer, _locale, _parent_id) VALUES (${q(faq.questionEn)}, ${q(lexicalAnswer(faq.answerEn, false))}, 'en', last_insert_rowid());\n`;
  batch += `INSERT INTO faqs_locales (question, answer, _locale, _parent_id) VALUES (${q(faq.questionAr)}, ${q(lexicalAnswer(faq.answerAr, true))}, 'ar', (SELECT id FROM faqs ORDER BY id DESC LIMIT 1));\n`;
}

batch += "COMMIT;\n";
batch += "SELECT COUNT(*) FROM faqs;\n";
batch += "SELECT _locale, COUNT(*) FROM faqs_locales GROUP BY _locale;\n";

const out = runBatch(batch);
console.log(out);
console.log("FAQs seeded.");
