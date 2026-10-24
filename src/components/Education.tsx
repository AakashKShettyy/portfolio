import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { education } from "../data/content";
import { CountUp } from "./motion/CountUp";
import { Reveal, SplitReveal } from "./motion/Reveal";
import { TiltCard } from "./motion/TiltCard";
import { EASE, useMotionOk } from "./motion/ready";
import "./styles/Education.css";

// Circular GPA dial: the ring fills to gpa/10 when scrolled into view.
const GpaDial = ({ gpa }: { gpa: number }) => {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const ok = useMotionOk();
  const filled = ok ? inView : true;

  return (
    <div className="dial">
      <svg ref={ref} viewBox="0 0 120 120" aria-hidden>
        <defs>
          <linearGradient id="dialGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent-bright)" />
            <stop offset="100%" stopColor="var(--accent-deep)" />
          </linearGradient>
        </defs>
        <circle className="dial-track" cx="60" cy="60" r="52" />
        <motion.circle
          className="dial-fill"
          cx="60"
          cy="60"
          r="52"
          initial={{ pathLength: ok ? 0 : gpa / 10 }}
          animate={{ pathLength: filled ? gpa / 10 : 0 }}
          transition={{ duration: 1.8, ease: EASE, delay: 0.2 }}
        />
      </svg>
      <div className="dial-center">
        <span className="display dial-num">
          <CountUp value={gpa} decimals={2} />
        </span>
        <span className="dial-of">/ 10 GPA</span>
      </div>
    </div>
  );
};

const Education = () => (
  <section id="education" className="section education stage-left">
    <div className="wrap">
      <Reveal>
        <span className="eyebrow">Education</span>
      </Reveal>
      <SplitReveal
        as="h2"
        className="display edu-title"
        text="Grounded in *data* and analytics."
      />

      <div className="edu-degrees">
        {education.degrees.map((d, i) => (
          <Reveal key={d.degree} delay={i * 0.12}>
            <TiltCard className="edu-card" tilt={3} cursor="default">
              <GpaDial gpa={d.gpa} />
              <div className="edu-card-body">
                <span className="edu-years">{d.years}</span>
                <h3 className="display edu-degree">{d.degree}</h3>
                <p className="edu-focus">{d.focus}</p>
                <p className="edu-school">{d.school}</p>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      <div className="edu-grid">
        <Reveal className="edu-block">
          <h3 className="edu-label">Relevant coursework</h3>
          <ul className="chips edu-chips">
            {education.coursework.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="edu-block">
          <h3 className="edu-label">Certifications</h3>
          <ul className="edu-list">
            {education.certifications.map((c) => (
              <li key={c.title}>
                <div>
                  <strong>{c.title}</strong>
                  <span>{c.issuer}</span>
                </div>
                <em>{c.year}</em>
                <p>{c.detail}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.2} className="edu-block">
          <h3 className="edu-label">Beyond the classroom</h3>
          <ul className="edu-list">
            {education.activities.map((a) => (
              <li key={a.title}>
                <div>
                  <strong>{a.title}</strong>
                </div>
                <em>{a.year}</em>
                <p>{a.detail}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  </section>
);

export default Education;
