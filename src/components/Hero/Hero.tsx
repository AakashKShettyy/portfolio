import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "../../data/content";
import { scrollToId } from "../../lib/smooth";
import { Reveal, SplitReveal } from "../motion/Reveal";
import { EASE, useSiteReady } from "../motion/ready";
import { nextWorld, switchWorld, useWorld, worlds, type WorldId } from "../../stage/world";
import { propPNG } from "../../stage/props3d";
import "../styles/Hero.css";

// One card per colour world (the "flavours"). A headline number sits where Soda
// shows the price; project names live in Experience and Work, not here.
const cards: { id: WorldId; token: string; name: string; metric: string }[] = [
  { id: "enterprise", token: "chat", name: "Enterprise AI", metric: "90% faster responses" },
  { id: "automation", token: "document", name: "Automation", metric: "25 → 3 min per invoice" },
  { id: "personal", token: "shield", name: "Personal", metric: "0 unsafe actions" },
];

const Hero = () => {
  const ready = useSiteReady();
  const world = useWorld();
  const [icons, setIcons] = useState<Record<string, string>>({});
  useEffect(() => {
    // Render each card's 3D prop once to an image.
    const out: Record<string, string> = {};
    cards.forEach((c) => (out[c.token] = propPNG(c.token)));
    setIcons(out);
  }, []);

  return (
    <section id="top" className="hero">
      <div className="hero-left">
        <h1 className="hero-name display" aria-label={profile.name}>
          <SplitReveal as="span" text={profile.first} className="hero-line outline" onReady delay={0.55} />
          <SplitReveal as="span" text={profile.last} className="hero-line" onReady delay={0.75} />
        </h1>

        <Reveal onReady delay={1.0} y={18}>
          <p className="hero-desc">
            I ship AI products end to end, from React to Postgres to Bedrock. Used every day by 3,000+ people.
          </p>
        </Reveal>

        <Reveal onReady delay={1.15} y={18}>
          <button className="cta" onClick={() => scrollToId("projects")}>
            See my work
            <span className="cta-plus" aria-hidden>
              +
            </span>
          </button>
        </Reveal>

        <Reveal onReady delay={1.3} y={18} className="hero-badge-wrap">
          <div className="hero-badge">
            <span className="hero-badge-icon" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7L12 3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="hero-badge-text">
              <strong>Data Scientist</strong>
              <span>Allcargo Global · Mumbai</span>
            </span>
          </div>
        </Reveal>
      </div>

      <div className="hero-right">
        <motion.div
          className="worlds"
          initial={{ opacity: 0, x: 40 }}
          animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
          transition={{ duration: 1, ease: EASE, delay: 1.0 }}
        >
          <div className="world-cards" role="tablist" aria-label="Project worlds">
            {cards.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={world === c.id}
                className={`world-card ${world === c.id ? "is-active" : ""}`}
                onClick={() => switchWorld(c.id)}
                data-cursor="link"
              >
                {icons[c.token] && <img src={icons[c.token]} alt="" />}
                <span className="world-card-info">
                  <strong>{c.name}</strong>
                  <span>{c.metric}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="world-nav">
            <button aria-label="Previous world" onClick={() => nextWorld(-1)}>
              ←
            </button>
            <span>{worlds[world].label}</span>
            <button aria-label="Next world" onClick={() => nextWorld(1)}>
              →
            </button>
          </div>
        </motion.div>

        <h2 className="hero-role display" aria-label="Full Stack and Gen AI">
          <SplitReveal as="span" text="Full" className="hero-line outline" onReady delay={0.65} />
          <SplitReveal as="span" text="Stack" className="hero-line" onReady delay={0.85} />
          <SplitReveal as="span" text="& GenAI" className="hero-line hero-line-sm outline" onReady delay={1.05} />
        </h2>
      </div>

      <motion.span
        className="hero-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1, delay: 1.8 }}
      >
        <i /> Scroll
      </motion.span>
    </section>
  );
};

export default Hero;
