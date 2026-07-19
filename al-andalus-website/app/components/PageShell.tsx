import type { ReactNode } from "react";
import Loader from "./Loader";
import SmoothScroll from "./SmoothScroll";
import GSAPAnimations from "./GSAPAnimations";
import HeaderServer from "./HeaderServer";
import FooterServer from "./FooterServer";
import ContactCtaServer from "./ContactCtaServer";

type PageShellProps = {
  children: ReactNode;
  /** Site-wide contact CTA strip. Default true. */
  showContactCta?: boolean;
  /** Homepage scroll choreography. Default true; safe to leave on secondary pages. */
  showGsap?: boolean;
};

/**
 * Shared frontend chrome: loader, smooth scroll, header, optional CTA, footer.
 * Keeps page files focused on their own sections.
 */
export default function PageShell({
  children,
  showContactCta = true,
  showGsap = true,
}: PageShellProps) {
  return (
    <>
      <Loader />
      <SmoothScroll>
        {showGsap ? <GSAPAnimations /> : null}
        <HeaderServer />
        {children}
        {showContactCta ? <ContactCtaServer /> : null}
        <FooterServer />
      </SmoothScroll>
    </>
  );
}
