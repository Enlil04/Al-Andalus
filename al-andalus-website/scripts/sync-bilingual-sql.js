const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "database.db");

function q(s) {
  return "'" + String(s).replace(/'/g, "''") + "'";
}

function sql(query) {
  const result = spawnSync("sqlite3", [dbPath, query], { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(result.stderr || `sqlite failed: ${query}`);
  }
  return (result.stdout || "").trim();
}

const products = [
  [
    "cargo",
    "Cargo Insurance",
    "تأمين نقل البضائع",
    "Goods in transit face risks at every stage. Cargo insurance covers loss or damage to goods moving by sea, road, or air.",
    "تتعرض البضائع أثناء النقل لمخاطر في كل مرحلة. يغطي تأمين الشحن الخسائر أو الأضرار التي تلحق بالبضائع المنقولة بحراً أو براً أو جواً.",
  ],
  [
    "engineering",
    "Engineering Insurance",
    "التأمين الهندسي",
    "Construction projects do not pause for accidents. Contractors' All Risks covers projects, machinery, and equipment against accidental damage during execution.",
    "المشاريع الإنشائية لا تتوقف بسبب الحوادث. يغطي تأمين جميع أخطار المقاولين المشاريع والمعدات والآلات ضد الأضرار العرضية أثناء التنفيذ.",
  ],
  [
    "glass",
    "Glass Insurance",
    "تأمين الألواح الزجاجية",
    "Glass facades and storefront panels are costly to replace. This policy compensates for damage or breakage to glass panels, facades, and installations.",
    "تكلفة استبدال الواجهات الزجاجية مرتفعة للغاية. تعوض هذه الوثيقة الأضرار أو الكسر الذي يصيب الواجهات والألواح والتركيبات الزجاجية.",
  ],
  [
    "burglary",
    "Burglary Insurance",
    "تأمين السرقة",
    "Theft and unlawful entry can wipe out inventory overnight. Burglary insurance protects property and assets against losses from theft, burglary, or break-in.",
    "قد تؤدي السرقة والدخول غير القانوني إلى فقدان المخزون في ليلة واحدة. يحمي تأمين السرقة الممتلكات والأصول من الخسائر الناتجة عن السطو.",
  ],
  [
    "bankers-blanket",
    "Bankers Blanket Insurance",
    "التأمين المصرفي الشامل",
    "Integrated cover for financial institutions against operational and financial risks.",
    "حلول تأمينية متكاملة لحماية المؤسسات المصرفية من المخاطر التشغيلية والمالية المتنوعة.",
  ],
  [
    "cash-in-transit",
    "Cash in Transit & Safe",
    "تأمين نقل وحفظ النقد",
    "Cash is most vulnerable when it moves. This policy covers cash during transport or in approved safes against theft, loss, and other covered perils.",
    "يكون النقد أكثر عرضة للمخاطر أثناء حركته. تغطي هذه الوثيقة النقد أثناء نقله أو في الخزائن المعتمدة ضد السرقة والفقدان.",
  ],
  [
    "public-liability",
    "Public Liability Insurance",
    "تأمين المسؤولية المدنية",
    "If your operations cause injury or property damage to a third party, the costs add up fast. Public liability insurance protects against legal liabilities arising from such incidents.",
    "إذا تسببت عملياتك في إصابة أو ضرر لممتلكات طرف ثالث، فإن التكاليف تتراكم بسرعة. يحميك تأمين المسؤولية المدنية من هذه المطالبات القانونية.",
  ],
  [
    "fire",
    "Fire Insurance",
    "تأمين الحريق",
    "Fire remains one of the most destructive risks for commercial property. Fire insurance covers losses and damage from fire and related perils.",
    "يظل الحريق أحد أكثر المخاطر تدميراً للممتلكات التجارية. يعوض تأمين الحريق الخسائر والأضرار الناتجة عن الحرائق والأخطار المرتبطة بها.",
  ],
  [
    "fidelity-guarantee",
    "Fidelity Guarantee Insurance",
    "تأمين ضمان الأمانة",
    "Employee dishonesty and fraud cause losses that standard property policies do not address. Fidelity guarantee insurance protects against financial loss from breach of trust.",
    "تسبب خيانة الأمانة والاحتيال خسائر لا تغطيها وثائق الممتلكات القياسية. يحمي هذا التأمين من الخسائر المالية الناتجة عن سوء أمانة الموظفين.",
  ],
  [
    "motor",
    "Motor Insurance",
    "تأمين السيارات",
    "Vehicles are essential across Iraq — and accidents create costs that add up fast. Motor insurance covers accidents, physical damage, and legal liabilities.",
    "تعتبر المركبات ضرورية في العراق، والحوادث تسبب تكاليف باهظة. يغطي تأمين السيارات الحوادث، الأضرار المادية، والمسؤوليات القانونية.",
  ],
  [
    "health",
    "Health Insurance",
    "التأمين الصحي",
    "Major medical procedures carry costs most families cannot absorb alone. Health insurance covers hospitalization, surgery, diagnostics, and related treatment expenses.",
    "تحمل العمليات الطبية الكبرى تكاليف لا تستطيع معظم الأسر تحملها بمفردها. يغطي التأمين الصحي الإقامة بالمستشفى، الجراحة، والتحاليل والعلاج.",
  ],
  [
    "loan-protection",
    "Loan Protection Insurance",
    "تأمين القروض",
    "Financial protection to help cover loan obligations when covered risks occur.",
    "حماية مالية تسهم في سداد الالتزامات المرتبطة بالقروض عند تحقق أي من المخاطر المشمولة بالوثيقة.",
  ],
  [
    "travel",
    "Travel Insurance",
    "تأمين السفر",
    "Travel involves risks you cannot fully control — medical emergencies abroad, lost baggage, accidents. Travel insurance covers these so a disrupted trip does not become a financial crisis.",
    "ينطوي السفر على مخاطر لا يمكن التحكم بها كالحالات الطبية الطارئة أو فقدان الأمتعة. يغطي تأمين السفر هذه الحالات لضمان راحة بالك.",
  ],
  [
    "medical-malpractice",
    "Medical Malpractice Insurance",
    "تأمين الأخطاء الطبية",
    "Healthcare professionals face professional liability exposure every working day. Medical malpractice insurance protects against claims arising from professional negligence or errors.",
    "يواجه ممارسو الرعاية الصحية مخاطر المسؤولية المهنية يومياً. يحمي تأمين الأخطاء الطبية من المطالبات الناتجة عن الإهمال أو الخطأ المهني.",
  ],
  [
    "hull",
    "Hull Insurance",
    "تأمين بدن السفن",
    "Vessels and their equipment represent significant capital at sea. Hull insurance covers physical loss or damage to vessels and associated marine equipment.",
    "تمثل السفن ومعداتها البحرية رأس مال كبير في عرض البحر. يغطي تأمين بدن السفن الخسائر أو الأضرار المادية التي تلحق بها وبمعداتها.",
  ],
  [
    "cyber",
    "Cyber Insurance",
    "تأمين الأمن السيبراني",
    "Protection against losses from cyberattacks, data breaches, and related incidents.",
    "حماية شاملة ضد الخسائر الناتجة عن الهجمات الإلكترونية، واختراق البيانات، والحوادث المتعلقة بالأنظمة الرقمية.",
  ],
];

const news = [
  [
    "al-andalus-expands-insurance-network",
    "Al-Andalus Expands Insurance Network",
    "الأندلس توسّع شبكة التأمين",
    "This is a placeholder excerpt for the news article to demonstrate the layout.",
    "هذا مقتطف تجريبي للمقال لإظهار تخطيط الصفحة.",
  ],
  [
    "new-health-insurance-packages-for-2027",
    "New Health Insurance Packages for 2027",
    "باقات تأمين صحي جديدة لعام 2027",
    "This is a placeholder excerpt for the news article to demonstrate the layout.",
    "هذا مقتطف تجريبي للمقال لإظهار تخطيط الصفحة.",
  ],
  [
    "awarded-best-insurtech-of-the-year",
    "Awarded Best Insurtech of the Year",
    "جائزة أفضل شركة تكنولوجيا تأمين للعام",
    "This is a placeholder excerpt for the news article to demonstrate the layout.",
    "هذا مقتطف تجريبي للمقال لإظهار تخطيط الصفحة.",
  ],
  [
    "important-update-on-motor-policies",
    "Important Update on Motor Policies",
    "تحديث مهم حول وثائق تأمين السيارات",
    "This is a placeholder excerpt for the news article to demonstrate the layout.",
    "هذا مقتطف تجريبي للمقال لإظهار تخطيط الصفحة.",
  ],
  [
    "navigating-travel-insurance-in-2026",
    "Navigating Travel Insurance in 2026",
    "دليلك لتأمين السفر في 2026",
    "This is a placeholder excerpt for the news article to demonstrate the layout.",
    "هذا مقتطف تجريبي للمقال لإظهار تخطيط الصفحة.",
  ],
];

let statements = "";

for (const [slug, titleEn, titleAr, descEn, descAr] of products) {
  const id = sql(`SELECT id FROM products WHERE slug=${q(slug)};`);
  if (!id) {
    console.log("missing product", slug);
    continue;
  }
  statements += `UPDATE products_locales SET title=${q(titleAr)}, short_description=${q(descAr)} WHERE _parent_id=${id} AND _locale='ar';\n`;
  statements += `INSERT OR IGNORE INTO products_locales (title, short_description, description, _locale, _parent_id) VALUES (${q(titleEn)}, ${q(descEn)}, NULL, 'en', ${id});\n`;
  statements += `UPDATE products_locales SET title=${q(titleEn)}, short_description=${q(descEn)} WHERE _parent_id=${id} AND _locale='en';\n`;
}

for (const [slug, titleEn, titleAr, excerptEn, excerptAr] of news) {
  const id = sql(`SELECT id FROM news WHERE slug=${q(slug)};`);
  if (!id) {
    console.log("missing news", slug);
    continue;
  }
  statements += `UPDATE news_locales SET title=${q(titleAr)}, excerpt=${q(excerptAr)} WHERE _parent_id=${id} AND _locale='ar';\n`;
  statements += `INSERT OR IGNORE INTO news_locales (title, content, excerpt, _locale, _parent_id) VALUES (${q(titleEn)}, NULL, ${q(excerptEn)}, 'en', ${id});\n`;
  statements += `UPDATE news_locales SET title=${q(titleEn)}, excerpt=${q(excerptEn)} WHERE _parent_id=${id} AND _locale='en';\n`;
}

fs.writeFileSync(path.join(__dirname, "_sync_locales.sql"), statements, "utf8");
const apply = spawnSync("sqlite3", [dbPath], {
  input: statements,
  encoding: "utf8",
});
if (apply.status !== 0) {
  console.error(apply.stderr);
  process.exit(1);
}

console.log(sql("SELECT _locale, COUNT(*) FROM products_locales GROUP BY _locale;"));
console.log(sql("SELECT _locale, COUNT(*) FROM news_locales GROUP BY _locale;"));
console.log("Synced bilingual product + news locales.");
