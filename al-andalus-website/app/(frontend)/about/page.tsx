import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import ScrollReveal from "../../components/ScrollReveal";
import SmoothScroll from "../../components/SmoothScroll";
import GSAPAnimations from "../../components/GSAPAnimations";
import AnimatedHeadline from "../../components/AnimatedHeadline";
import PageBanner from "../../components/PageBanner";
import FourDivisionsSection from "../../components/FourDivisionsSection";
import VisionMission from "../../components/VisionMission";
import ContactCta from "../../components/ContactCta";
import {
  fetchAboutPageContent,
  fetchHomepageContent,
  fetchSiteSettings,
} from "@/lib/cms/content";
import { getCMSPayload } from "@/lib/cms/payload";
import { siteCopy } from "@/lib/copy/en";

const missionImage = "/al-and images/Misty Urban Development.png";
const missionAccentImage = "/al-and images/Modern Office Interior.png";

const { aboutPage } = siteCopy;
const { mission } = aboutPage;

export const metadata = {
  title: siteCopy.meta.about.title,
  description: siteCopy.meta.about.description,
};

export default async function AboutPage() {
  const payload = await getCMSPayload();
  const [aboutContent, { contactCta }, siteSettings] = await Promise.all([
    fetchAboutPageContent(payload),
    fetchHomepageContent(payload),
    fetchSiteSettings(payload),
  ]);



  return (
    <>
      <Loader />
      <SmoothScroll>
        <GSAPAnimations />
        <Header />

        <PageBanner
          title={aboutContent.bannerTitle}
          subtitle={aboutContent.bannerSubtitle}
        />

        {/* ═══════════════ 2–3. MISSION ═══════════════ */}
        <section className="about-mission" id="mission">
          <div className="about-grid">
            <div className="about-mission__top about-grid__span-all">
              <div className="about-mission__top-left about-grid__cols-1-6">
                <ScrollReveal>
                  <span className="about-mission__label">{mission.label}</span>
                </ScrollReveal>
                <AnimatedHeadline
                  title={mission.headline}
                  className="about-mission__headline"
                />
                <ScrollReveal delay={2}>
                  <p className="about-mission__subline">
                    {mission.subline.split("\n").map((line, index) => (
                      <span key={line}>
                        {index > 0 ? <br /> : null}
                        {line}
                      </span>
                    ))}
                  </p>
                </ScrollReveal>
              </div>

              <div className="about-mission__top-right about-grid__cols-7-12">
                <ScrollReveal delay={1}>
                  <div
                    className="about-mission__image"
                    style={{
                      backgroundImage: `url("${aboutContent.heroImageUrl ?? missionImage}")`,
                    }}
                    role="img"
                    aria-label="Urban development representing Iraq's growth"
                  />
                </ScrollReveal>
              </div>
            </div>

            <div className="about-mission__bottom about-grid__span-all">
              <div
                className="about-mission__bottom-image about-grid__cols-1-5"
                style={{ backgroundImage: `url("${missionAccentImage}")` }}
                role="img"
                aria-label="Modern office interior"
              />

              <div className="about-mission__bottom-content about-grid__cols-7-12">
                <AnimatedHeadline
                  title={mission.bodyTitle}
                  className="about-mission__bottom-title"
                  as="h3"
                />
                <ScrollReveal delay={1}>
                  <div className="about-mission__bottom-text">
                    {aboutContent.missionParagraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ VISION & MISSION ═══════════════ */}
        <VisionMission />

        {/* ═══════════════ 4. WHY CHOOSE US ═══════════════ */}
        <FourDivisionsSection />

        {/* ═══════════════ LEADERSHIP MESSAGES ═══════════════ */}
        {aboutContent.leadership.map((leader, index) => {
          const isMirrored = index % 2 !== 0;
          const sectionId = index === 0 ? "leadership" : `leadership-${index}`;
          const title = index === 0 
            ? aboutPage.leadership.ceo.title 
            : (index === 1 ? aboutPage.leadership.md.title : `${leader.role} Message`);

          return (
            <section
              className={`about-message${isMirrored ? " about-message--mirrored" : ""}`}
              id={sectionId}
              key={leader.name}
            >
              <div className="about-message__stage">
                <div
                  className="about-message__hero"
                  role="img"
                  aria-label={`${leader.name} portrait`}
                  style={
                    leader.photoUrl
                      ? {
                          backgroundImage: `url("${leader.photoUrl}")`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                />

                <div className="about-message__panel-wrap">
                  <div className="about-message__panel">
                    <ScrollReveal>
                      <span className="about-message__label">
                        {aboutPage.leadership.label}
                      </span>
                    </ScrollReveal>
                    <AnimatedHeadline
                      title={title}
                      className="about-message__title"
                    />
                    <ScrollReveal delay={2}>
                      <div className="about-message__text">
                        {leader.bioParagraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                        <p className="about-message__signoff">
                          <strong>{leader.name}</strong>
                          <br />
                          {leader.role}
                        </p>
                      </div>
                    </ScrollReveal>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        {/* ═══════════════ COMPANY SNAPSHOT ═══════════════ */}
        <section className="about-company" id="company">
          <div className="about-grid">
            <AnimatedHeadline
              title="( COMPANY )"
              className="about-company__title about-grid__section-title"
            />

            <div className="about-company__list about-grid__span-all">
              {aboutPage.companySnapshot.map((row) => (
                <div className="about-company__row" key={row.label}>
                  <span className="about-company__label">{row.label}</span>
                  <p className="about-company__value">{row.value}</p>
                </div>
              ))}

              <div className="about-company__row">
                <span className="about-company__label">Board member</span>
                <div className="about-company__board">
                  {aboutPage.boardMembers.map((member) => (
                    <p className="about-company__board-entry" key={member.name}>
                      <strong>{member.role}:</strong> {member.name}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <ContactCta
          headline={contactCta.headline}
          lines={contactCta.lines}
          cta={contactCta.cta}
          ctaLink={contactCta.ctaLink}
        />

        <Footer socialLinks={siteSettings.socialLinks} />
      </SmoothScroll>
    </>
  );
}
