import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ProjectCategory,
  projectCategories,
  projects,
} from "../data/content";
import { Reveal, SplitReveal } from "./motion/Reveal";
import { TiltCard } from "./motion/TiltCard";
import { EASE } from "./motion/ready";
import "./styles/Projects.css";

type Tab = "all" | ProjectCategory;

const badgeOf = (cat: ProjectCategory) =>
  projectCategories.find((c) => c.id === cat)?.badge ?? "";

const Projects = () => {
  const [tab, setTab] = useState<Tab>("all");
  const first = useRef(true);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length };
    projects.forEach((p) => (c[p.category] = (c[p.category] ?? 0) + 1));
    return c;
  }, []);

  const shown = useMemo(
    () => (tab === "all" ? projects : projects.filter((p) => p.category === tab)),
    [tab]
  );

  // The page height changes with the filter, so re-measure scroll triggers.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const id = setTimeout(() => ScrollTrigger.refresh(), 650);
    return () => clearTimeout(id);
  }, [tab]);

  const onKey = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next =
      projectCategories[(index + dir + projectCategories.length) % projectCategories.length];
    setTab(next.id);
    (e.currentTarget.parentElement?.children[
      projectCategories.indexOf(next)
    ] as HTMLElement | undefined)?.focus();
  };

  return (
    <section id="projects" className="section projects">
      <div className="wrap">
        <div className="proj-head">
          <div>
            <Reveal>
              <span className="eyebrow">Projects</span>
            </Reveal>
            <SplitReveal
              as="h2"
              className="display proj-title"
              text="Systems in *production.*"
            />
          </div>
          <Reveal delay={0.15} className="proj-note">
            <p>
              Enterprise and automation work shipped at Allcargo, plus personal
              projects built on my own time.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="proj-tabs" role="tablist" aria-label="Project categories">
            {projectCategories.map((c, i) => {
              const active = tab === c.id;
              return (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  className={`proj-tab ${active ? "is-active" : ""}`}
                  onClick={() => setTab(c.id)}
                  onKeyDown={(e) => onKey(e, i)}
                >
                  {active && (
                    <motion.i
                      layoutId="proj-tab-pill"
                      className="proj-tab-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span className="proj-tab-label">{c.label}</span>
                  <span className="proj-tab-count">{counts[c.id] ?? 0}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <motion.div className="proj-grid" layout role="tabpanel">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <motion.div
                key={p.name}
                layout
                className="proj-cell"
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.7, ease: EASE, delay: i * 0.05 },
                }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
                transition={{ layout: { duration: 0.6, ease: EASE } }}
              >
                <TiltCard className="proj-card" tilt={5} cursor={p.link ? "view" : "default"}>
                  <div className="proj-card-top">
                    <span className={`proj-badge badge-${p.category}`}>
                      {badgeOf(p.category)}
                    </span>
                    <span className="proj-sub">{p.subtitle}</span>
                  </div>
                  <h3 className="display proj-name">{p.name}</h3>
                  <div className="proj-metric">
                    <span className="display">{p.metric}</span>
                    <small>{p.metricLabel}</small>
                  </div>
                  <p className="proj-text">{p.text}</p>
                  <ul className="chips proj-tools">
                    {p.tools.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  {p.link && (
                    <a
                      className="proj-link"
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="view"
                      aria-label={`${p.name} on GitHub`}
                    >
                      GitHub ↗
                    </a>
                  )}
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
