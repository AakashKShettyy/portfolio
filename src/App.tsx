import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pauseScroll, SmoothScroll } from "./lib/smooth";
import { ReadyContext } from "./components/motion/ready";
import Loader from "./components/Loader";
import Cursor from "./components/Cursor";
import Nav from "./components/Nav";
import Hero from "./components/Hero/Hero";
import Stage from "./stage/Stage";
import Overlay from "./stage/Overlay";
import Motes from "./stage/Motes";
import { startScrollSync } from "./stage/sync";
import Metrics from "./components/Metrics";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Contact from "./components/Contact";

const TechStack = lazy(() => import("./components/TechStack"));

const App = () => {
  const [ready, setReady] = useState(false);
  const onDone = useCallback(() => setReady(true), []);

  useEffect(() => {
    if (!ready) return;
    document.body.classList.remove("is-locked");
    window.dispatchEvent(new Event("site-ready"));
    pauseScroll(false);
    window.scrollTo(0, 0);
    // Layout settles after fonts and the hero canvas; re-measure the pins.
    const id = setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => clearTimeout(id);
  }, [ready]);

  useEffect(() => (ready ? startScrollSync() : undefined), [ready]);

  return (
    <ReadyContext.Provider value={ready}>
      <AnimatePresence>{!ready && <Loader onDone={onDone} />}</AnimatePresence>
      <div className="world-bg" aria-hidden />
      <Motes />
      <Stage />
      <Overlay />
      <Cursor />
      <Nav />
      <SmoothScroll>
        <main>
          <Hero />
          <Metrics />
          <About />
          <Experience />
          <Projects />
          <Education />
          <Suspense fallback={null}>
            <TechStack />
          </Suspense>
          <Contact />
        </main>
      </SmoothScroll>
    </ReadyContext.Provider>
  );
};

export default App;
