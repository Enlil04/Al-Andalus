import HeaderServer from "../../components/HeaderServer";
import FooterServer from "../../components/FooterServer";
import Loader from "../../components/Loader";
import ScrollReveal from "../../components/ScrollReveal";
import SmoothScroll from "../../components/SmoothScroll";
import GSAPAnimations from "../../components/GSAPAnimations";
import AnimatedHeadline from "../../components/AnimatedHeadline";
import PageBanner from "../../components/PageBanner";
import FourDivisionsSection from "../../components/FourDivisionsSection";
import VisionMission from "../../components/VisionMission";
import ContactCtaServer from "../../components/ContactCtaServer";
import { fetchAboutPageContent } from "@/lib/cms/content";
import { getSiteCopy } from "@/lib/copy";
import { getLocale } from "@/lib/locale";

export async function generateMetadata() {
  const locale = await getLocale();
  const siteCopy = getSiteCopy(locale);
  return {
    title: siteCopy.meta.about.title,
    description: siteCopy.meta.about.description,
  };
}

export default async function AboutPage() {
  const aboutContent = await fetchAboutPageContent();

  return (
    <>
      <Loader />
      <SmoothScroll>
        <GSAPAnimations />
        <HeaderServer />

        <PageBanner
          title={aboutContent.bannerTitle}
          subtitle={aboutContent.bannerSubtitle}
          imageSrc={
            aboutContent.heroImageUrl ??
            "/al-and images/ChatGPT Image Jul 15, 2026, 09_56_24 PM.png"
          }
        />

        {/* ═══════════════ 2–3. MISSION ═══════════════ */}
        <section className="about-mission" id="mission">
          <div className="about-grid">
            <div className="about-mission__top about-grid__span-all">
              <div className="about-mission__top-left about-grid__cols-1-6">
                <ScrollReveal>
                  <span className="about-mission__label">{aboutContent.missionLabel}</span>
                </ScrollReveal>
                <AnimatedHeadline
                  title={aboutContent.missionHeadline}
                  className="about-mission__headline"
                />
                <ScrollReveal delay={2}>
                  <p className="about-mission__subline">
                    {aboutContent.missionSubline.split("\n").map((line, index) => (
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
                      backgroundImage: `url("${aboutContent.missionImageUrl}")`,
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
                style={{ backgroundImage: `url("${aboutContent.missionAccentImage}")` }}
                role="img"
                aria-label="Modern office interior"
              />

              <div className="about-mission__bottom-content about-grid__cols-7-12">
                <AnimatedHeadline
                  title={aboutContent.missionBodyTitle}
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
        <VisionMission {...aboutContent.vision} />

        {/* ═══════════════ 4. WHY CHOOSE US ═══════════════ */}
        <FourDivisionsSection {...aboutContent.whyChoose} />

        {/* ═══════════════ LEADERSHIP MESSAGES ═══════════════ */}
        {aboutContent.leadership.map((leader, index) => {
          const isMirrored = index % 2 !== 0;
          const sectionId = index === 0 ? "leadership" : `leadership-${index}`;

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
                        {aboutContent.leadershipLabel}
                      </span>
                    </ScrollReveal>
                    <AnimatedHeadline
                      title={leader.messageTitle}
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
              title={aboutContent.companyTitle}
              className="about-company__title about-grid__section-title"
            />

            <div className="about-company__list about-grid__span-all">
              {aboutContent.companyRows.map((row) => (
                <div className="about-company__row" key={row.label}>
                  <span className="about-company__label">{row.label}</span>
                  <p className="about-company__value">{row.value}</p>
                </div>
              ))}

              <div className="about-company__row">
                <span className="about-company__label">{aboutContent.boardLabel}</span>
                <div className="about-company__board">
                  {aboutContent.boardMembers.map((member) => (
                    <p className="about-company__board-entry" key={member.name}>
                      <strong>{member.role}:</strong> {member.name}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <ContactCtaServer />

        <FooterServer />
      </SmoothScroll>
    </>
  );
}
