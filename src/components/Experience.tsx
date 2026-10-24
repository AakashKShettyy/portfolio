import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { work } from "../data/content";
import { scrollToId } from "../lib/smooth";
import { Reveal, SplitReveal } from "./motion/Reveal";
import { useMotionOk } from "./motion/ready";
import "./styles/Experience.css";

const Experience = () => {
  const ok = useMotionOk();
  const list = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: list,
    offset: ["start 65%", "end 60%"],
  });
  const draw = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section id="experience" className="section experience stage-left">
      <div className="wrap">
        <Reveal>
          <span className="eyebrow">Work experience</span>
        </Reveal>
        <SplitReveal
          as="h2"
          className="display exp-title"
          text="Where I've *built* real things."
        />

        <div className="exp-layout">
          <Reveal className="exp-company-wrap">
            <aside className="exp-company">
              <span className="exp-company-tag">Current employer</span>
              <h3 className="display exp-company-name">{work.company}</h3>
              <p className="exp-company-div">{work.division}</p>
              <dl>
                <div>
                  <dt>Location</dt>
                  <dd>{work.location}</dd>
                </div>
                <div>
                  <dt>Since</dt>
                  <dd>{work.since}</dd>
                </div>
                <div>
                  <dt>Roles</dt>
                  <dd>{work.roles.length}</dd>
                </div>
              </dl>
            </aside>
          </Reveal>

          <div className="exp-roles" ref={list}>
            <div className="exp-line" aria-hidden>
              <motion.i style={{ scaleY: ok ? draw : 1 }} />
            </div>
            {work.roles.map((r) => (
              <Reveal key={r.title} className="exp-role-card">
                <span className="exp-dot" aria-hidden />
                <span className="exp-period">{r.period}</span>
                <h3 className="display exp-role">{r.title}</h3>
                <p className="exp-summary">{r.summary}</p>
                <ul className="exp-bullets">
                  {r.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <ul className="chips exp-tech">
                  {r.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <div className="exp-projects">
                  <span>Projects</span>
                  {r.projects.map((p) => (
                    <button key={p} onClick={() => scrollToId("projects")}>
                      {p} <i aria-hidden>↗</i>
                    </button>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
