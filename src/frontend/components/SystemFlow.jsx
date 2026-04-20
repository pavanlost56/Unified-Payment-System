import { useEffect, useRef, useState } from "react";

const flowSteps = [
  {
    title: "User",
    text: "Starts a checkout session."
  },
  {
    title: "Country Selection",
    text: "Defines currency and route."
  },
  {
    title: "Router",
    text: "Locks the correct gateway."
  },
  {
    title: "Gateway",
    text: "Executes or stages payment."
  },
  {
    title: "Verification",
    text: "Confirms payment integrity."
  },
  {
    title: "Database",
    text: "Persists transaction state."
  },
  {
    title: "Dashboard",
    text: "Reflects payment outcomes."
  }
];

export default function SystemFlow() {
  const gridRef = useRef(null);
  const stepRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [stepCenters, setStepCenters] = useState([]);
  const currentIndex = hoveredIndex ?? activeIndex;
  const railStart = stepCenters[0] ?? 0;
  const railEnd = stepCenters[stepCenters.length - 1] ?? railStart;
  const signalLeft = stepCenters[currentIndex] ?? railStart;
  const railWidth = Math.max(0, railEnd - railStart);
  const progressWidth = Math.max(0, signalLeft - railStart);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % flowSteps.length);
    }, 1500);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (!gridRef.current) {
        return;
      }

      setStepCenters(
        stepRefs.current
          .map((element) => {
            if (!element) {
              return null;
            }

            return element.offsetLeft + element.offsetWidth / 2;
          })
          .filter((value) => value !== null)
      );
    };

    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);

      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    stepRefs.current.forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section className="flow-shell">
      <div className="flow-head">
        <p className="eyebrow">System flow</p>
        <h2>How the system works</h2>
        <p className="muted-copy">
          Every checkout moves through a strict routing chain so country, currency, verification,
          and dashboard state stay aligned.
        </p>
      </div>

      <div
        ref={gridRef}
        className="flow-grid"
        role="list"
        aria-label="Unified Payment System flow"
      >
        <div
          className="flow-line"
          aria-hidden="true"
          style={{
            left: `${railStart}px`,
            width: `${railWidth}px`
          }}
        >
          <span className="flow-line-progress" style={{ width: `${progressWidth}px` }} />
          <span className="flow-line-signal" style={{ left: `${progressWidth}px` }} />
        </div>
        {flowSteps.map((step, index) => (
          <article
            key={step.title}
            role="listitem"
            ref={(element) => {
              stepRefs.current[index] = element;
            }}
            className={[
              "flow-step",
              index === currentIndex ? "is-active" : "",
              index < currentIndex ? "is-complete" : ""
            ]
              .filter(Boolean)
              .join(" ")}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(index)}
            onBlur={() => setHoveredIndex(null)}
            tabIndex={0}
          >
            <span className="flow-step-node" aria-hidden="true" />
            <span className="flow-step-index">{String(index + 1).padStart(2, "0")}</span>
            <strong>{step.title}</strong>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
