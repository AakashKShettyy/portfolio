import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "../data/content";
import { Magnetic } from "./motion/Magnetic";
import { Reveal, SplitReveal } from "./motion/Reveal";
import { EASE } from "./motion/ready";
import "./styles/Contact.css";

const Contact = () => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      window.location.href = `mailto:${profile.email}`;
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="contact" className="section contact stage-left">
      <div className="wrap">
        <Reveal>
          <span className="eyebrow">Contact</span>
        </Reveal>
        <SplitReveal
          as="h2"
          className="display contact-title"
          text="Let's build something *exceptional.*"
        />

        <Reveal delay={0.2} className="contact-cta">
          <Magnetic strength={0.2}>
            <button className="contact-mail" onClick={copy} data-cursor="link">
              <span className="contact-mail-text">{profile.email}</span>
              <span className="contact-mail-copy">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "done" : "copy"}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    {copied ? "Copied ✓" : "Copy"}
                  </motion.span>
                </AnimatePresence>
              </span>
            </button>
          </Magnetic>
          <a className="contact-mailto" href={`mailto:${profile.email}`}>
            or open your mail app ↗
          </a>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="contact-grid">
            <div>
              <h4>Phone</h4>
              <a href={profile.phoneHref}>{profile.phone}</a>
            </div>
            <div>
              <h4>Based in</h4>
              <span>{profile.location}</span>
            </div>
            <div>
              <h4>Elsewhere</h4>
              <a href={profile.github} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
            </div>
            <div>
              <h4>Résumé</h4>
              <a href={profile.resume} download>
                Download ↓
              </a>
            </div>
          </div>
        </Reveal>

        <footer className="footer">
          <span>© 2026 {profile.name}</span>
          <span>
            Avatar &amp; desk scene by{" "}
            <a href="https://moncy.dev" target="_blank" rel="noreferrer">
              Moncy Yohannan
            </a>{" "}
            (used with permission)
          </span>
        </footer>
      </div>
    </section>
  );
};

export default Contact;
