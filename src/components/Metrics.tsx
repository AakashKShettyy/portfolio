import { metrics } from "../data/content";
import { CountUp } from "./motion/CountUp";
import { Reveal } from "./motion/Reveal";
import "./styles/Metrics.css";

const Metrics = () => (
  <section className="metrics" aria-label="Impact in numbers">
    <div className="wrap metrics-grid">
      {metrics.map((m, i) => (
        <Reveal key={m.label} delay={i * 0.1} className="metric">
          <div className="display metric-value">
            <CountUp value={m.value} suffix={m.suffix} decimals={m.decimals} />
          </div>
          <p className="metric-label">{m.label}</p>
        </Reveal>
      ))}
    </div>
  </section>
);

export default Metrics;
