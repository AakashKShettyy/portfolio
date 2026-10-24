import { about, capabilities } from "../data/content";
import { Parallax } from "./motion/Parallax";
import { Reveal, SplitReveal } from "./motion/Reveal";
import { TiltCard } from "./motion/TiltCard";
import "./styles/About.css";

const About = () => (
  <section id="about" className="section about stage-left">
    <div className="wrap">
      <Reveal>
        <span className="eyebrow">About</span>
      </Reveal>

      <Parallax offset={28}>
        <SplitReveal
          as="h2"
          className="display about-statement"
          text={about.statement}
        />
      </Parallax>

      <div className="about-grid">
        <Reveal delay={0.1}>
          <p className="about-body">{about.body}</p>
        </Reveal>

        <div className="caps">
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={0.15 + i * 0.12}>
              <TiltCard className="cap" tilt={4} cursor="default">
                <div className="cap-top">
                  <span className="cap-index">{c.index}</span>
                  <h3 className="display cap-title">{c.title}</h3>
                </div>
                <p className="cap-text">{c.text}</p>
                <ul className="chips">
                  {c.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default About;
