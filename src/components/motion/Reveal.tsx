import { ElementType, ReactNode, useMemo } from "react";
import { motion } from "framer-motion";
import { EASE, useMotionOk, useSiteReady } from "./ready";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  /** Wait for the loader instead of the viewport (hero content). */
  onReady?: boolean;
}

export const Reveal = ({
  children,
  delay = 0,
  y = 36,
  className,
  onReady,
}: RevealProps) => {
  const ok = useMotionOk();
  const ready = useSiteReady();
  if (!ok) return <div className={className}>{children}</div>;

  const transition = { duration: 1, ease: EASE, delay };
  const target = { opacity: 1, y: 0 };
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      {...(onReady
        ? { animate: ready ? target : { opacity: 0, y } }
        : {
            whileInView: target,
            viewport: { once: true, margin: "0px 0px -12% 0px" },
          })}
      transition={transition}
    >
      {children}
    </motion.div>
  );
};

interface SplitRevealProps {
  /** Wrap a single word in *asterisks* for the italic gold accent. */
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  onReady?: boolean;
}

export const SplitReveal = ({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.055,
  onReady,
}: SplitRevealProps) => {
  const ok = useMotionOk();
  const ready = useSiteReady();
  const MotionTag = useMemo(() => motion.create(Tag), [Tag]);
  const words = text.split(" ").map((raw) => {
    const em = raw.startsWith("*") && raw.endsWith("*");
    return { word: em ? raw.slice(1, -1) : raw, em };
  });

  if (!ok) {
    return (
      <Tag className={className}>
        {words.map((w, i) => (
          <span key={i}>
            {w.em ? <em>{w.word}</em> : w.word}{" "}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      {...(onReady
        ? { animate: ready ? "show" : "hidden" }
        : {
            whileInView: "show",
            viewport: { once: true, margin: "0px 0px -12% 0px" },
          })}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={words.map((w) => w.word).join(" ")}
    >
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "bottom",
            paddingBottom: "0.12em",
            marginBottom: "-0.12em",
          }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            variants={{
              hidden: { y: "115%", rotate: 4 },
              show: {
                y: "0%",
                rotate: 0,
                transition: { duration: 1.05, ease: EASE },
              },
            }}
          >
            {w.em ? <em>{w.word}</em> : w.word}
            {" "}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
};
