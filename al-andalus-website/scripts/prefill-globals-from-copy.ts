/**
 * Prefill Site Settings, Homepage, and About Page with the live website copy
 * so editors see current content in the dashboard fields.
 */
import { randomUUID } from "crypto";
import { createClient } from "@libsql/client";
import { siteCopy as en } from "../lib/copy/en";
import { siteCopy as ar } from "../lib/copy/ar";

const client = createClient({ url: "file:./database.db" });

function lexicalFromParagraphs(paragraphs: readonly string[], rtl = false) {
  return JSON.stringify({
    root: {
      type: "root",
      children: paragraphs.map((text) => ({
        type: "paragraph",
        children: [{ type: "text", text, version: 1 }],
        direction: rtl ? "rtl" : "ltr",
        format: "",
        indent: 0,
        version: 1,
      })),
      direction: rtl ? "rtl" : "ltr",
      format: "",
      indent: 0,
      version: 1,
    },
  });
}

function now() {
  return new Date().toISOString();
}

async function ensureRow(table: string) {
  const result = await client.execute(`SELECT COUNT(*) AS c FROM ${table}`);
  if (Number(result.rows[0].c) === 0) {
    await client.execute({
      sql: `INSERT INTO ${table} (id, updated_at, created_at) VALUES (1, ?, ?)`,
      args: [now(), now()],
    });
  }
}

async function main() {
  await ensureRow("site_settings");
  await ensureRow("homepage");
  await ensureRow("about_page");

  await client.execute({
    sql: `
    UPDATE site_settings SET
      company_name_en = ?,
      company_name_ar = ?,
      hero_text_en = ?,
      hero_text_ar = ?,
      hero_subtext_en = ?,
      hero_subtext_ar = ?,
      updated_at = ?
    WHERE id = 1
  `,
    args: [
      "Al-Andalus International Insurance",
      "شركة الأندلس للتأمين الدولي",
      en.hero.headline,
      ar.hero.headline,
      en.hero.headlineRight,
      ar.hero.headlineRight,
      now(),
    ],
  });

  const slideCount = await client.execute(
    "SELECT COUNT(*) AS c FROM homepage_hero_slides",
  );
  if (Number(slideCount.rows[0].c) === 0) {
    const slideId = randomUUID();
    await client.execute({
      sql: `
      INSERT INTO homepage_hero_slides (
        id, _order, _parent_id,
        headline_en, headline_ar,
        subheadline_en, subheadline_ar,
        cta_text_en, cta_text_ar,
        cta_link
      ) VALUES (?, 1, 1, ?, ?, ?, ?, ?, ?, ?)
    `,
      args: [
        slideId,
        en.hero.headline,
        ar.hero.headline,
        en.hero.headlineRight,
        ar.hero.headlineRight,
        "",
        "",
        "",
      ],
    });
  } else {
    await client.execute({
      sql: `
      UPDATE homepage_hero_slides SET
        headline_en = ?,
        headline_ar = ?,
        subheadline_en = ?,
        subheadline_ar = ?
      WHERE _parent_id = 1
    `,
      args: [
        en.hero.headline,
        ar.hero.headline,
        en.hero.headlineRight,
        ar.hero.headlineRight,
      ],
    });
  }

  await client.execute({
    sql: `
    UPDATE homepage SET
      intro_title_line1_en = ?,
      intro_title_line1_ar = ?,
      intro_title_line2_en = ?,
      intro_title_line2_ar = ?,
      intro_title_line3_en = ?,
      intro_title_line3_ar = ?,
      intro_lead_en = ?,
      intro_lead_ar = ?,
      story_title_en = ?,
      story_title_ar = ?,
      story_description_en = ?,
      story_description_ar = ?,
      story_cta_text_en = ?,
      story_cta_text_ar = ?,
      story_cta_link = COALESCE(NULLIF(story_cta_link, ''), '#about'),
      about_preview_title_en = ?,
      about_preview_title_ar = ?,
      about_preview_description_en = ?,
      about_preview_description_ar = ?,
      about_preview_cta_text_en = ?,
      about_preview_cta_text_ar = ?,
      about_preview_cta_link = COALESCE(NULLIF(about_preview_cta_link, ''), '/about'),
      contact_cta_title_en = ?,
      contact_cta_title_ar = ?,
      contact_cta_description_en = ?,
      contact_cta_description_ar = ?,
      contact_cta_button_text_en = ?,
      contact_cta_button_text_ar = ?,
      contact_cta_button_link = COALESCE(NULLIF(contact_cta_button_link, ''), '/contact'),
      updated_at = ?
    WHERE id = 1
  `,
    args: [
      en.intro.headline[0],
      ar.intro.headline[0],
      en.intro.headline[1],
      ar.intro.headline[1],
      en.intro.headline[2],
      ar.intro.headline[2],
      en.intro.lead,
      ar.intro.lead,
      "Our Story",
      "قصتنا",
      en.story.paragraphs.join("\n\n"),
      ar.story.paragraphs.join("\n\n"),
      en.story.cta,
      ar.story.cta,
      en.aboutPinned.headline,
      ar.aboutPinned.headline,
      en.aboutPinned.text,
      ar.aboutPinned.text,
      en.story.cta,
      ar.story.cta,
      en.contact.headline,
      ar.contact.headline,
      en.contact.lines.join("\n"),
      ar.contact.lines.join("\n"),
      en.contact.cta,
      ar.contact.cta,
      now(),
    ],
  });

  const historyEn = en.aboutPage.history
    .map((item) => `${item.year}: ${item.event}`)
    .join("\n\n");
  const historyAr = ar.aboutPage.history
    .map((item) => `${item.year}: ${item.event}`)
    .join("\n\n");

  await client.execute({
    sql: `
    UPDATE about_page SET
      hero_title_en = ?,
      hero_title_ar = ?,
      intro_en = ?,
      intro_ar = ?,
      mission_en = ?,
      mission_ar = ?,
      vision_en = ?,
      vision_ar = ?,
      history_en = ?,
      history_ar = ?,
      updated_at = ?
    WHERE id = 1
  `,
    args: [
      en.aboutPage.banner.title,
      ar.aboutPage.banner.title,
      lexicalFromParagraphs(en.aboutPage.mission.paragraphs.slice(0, 2)),
      lexicalFromParagraphs(ar.aboutPage.mission.paragraphs.slice(0, 2), true),
      lexicalFromParagraphs(en.aboutPage.mission.paragraphs),
      lexicalFromParagraphs(ar.aboutPage.mission.paragraphs, true),
      lexicalFromParagraphs(en.aboutPage.vision.paragraphs),
      lexicalFromParagraphs(ar.aboutPage.vision.paragraphs, true),
      lexicalFromParagraphs([historyEn]),
      lexicalFromParagraphs([historyAr], true),
      now(),
    ],
  });

  await client.execute("DELETE FROM about_page_leadership WHERE _parent_id = 1");

  const leaders = [
    {
      order: 1,
      nameEn: en.aboutPage.leadership.ceo.signoff,
      nameAr: ar.aboutPage.leadership.ceo.signoff,
      roleEn: en.aboutPage.leadership.ceo.role,
      roleAr: ar.aboutPage.leadership.ceo.role,
      bioEn: en.aboutPage.leadership.ceo.paragraphs.join("\n\n"),
      bioAr: ar.aboutPage.leadership.ceo.paragraphs.join("\n\n"),
    },
    {
      order: 2,
      nameEn: en.aboutPage.leadership.md.signoff,
      nameAr: ar.aboutPage.leadership.md.signoff,
      roleEn: en.aboutPage.leadership.md.role,
      roleAr: ar.aboutPage.leadership.md.role,
      bioEn: en.aboutPage.leadership.md.paragraphs.join("\n\n"),
      bioAr: ar.aboutPage.leadership.md.paragraphs.join("\n\n"),
    },
  ];

  for (const leader of leaders) {
    await client.execute({
      sql: `
      INSERT INTO about_page_leadership (
        id, _order, _parent_id,
        name_en, name_ar, role_en, role_ar, bio_en, bio_ar
      ) VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?)
    `,
      args: [
        randomUUID(),
        leader.order,
        leader.nameEn,
        leader.nameAr,
        leader.roleEn,
        leader.roleAr,
        leader.bioEn,
        leader.bioAr,
      ],
    });
  }

  console.log("Prefill complete:");
  console.log("- site-settings: company + hero EN/AR");
  console.log("- homepage: intro, story, about preview, contact CTA, hero slide");
  console.log("- about-page: title, intro, mission, vision, history, leadership");

  client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
