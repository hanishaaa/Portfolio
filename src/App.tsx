import React from "react";
import { motion } from "framer-motion";

// Simple no-op analytics helper so the CTA handlers compile.
const trackEvent = (_event: string, _meta?: Record<string, string>) => {};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 gradient-ring">
      <Navbar />
      <main className="section-container pt-28 pb-20 space-y-24">
        <Hero />
        <Projects />
        <Experience />
        <Skills />
        <Contact />
      </main>
    </div>
  );
};

// Top navbar
const Navbar: React.FC = () => {
  const links = [
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" }
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <div className="section-container py-4">
        <motion.nav
          className="glass-panel flex items-center justify-between rounded-2xl px-4 py-3"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          aria-label="Primary"
        >
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <span className="h-7 w-7 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-300 text-xs font-bold">
              HM
            </span>
            <span className="text-slate-100">Hanisha Mendu</span>
          </div>

          <nav className="hidden md:flex items-center gap-1 text-xs" aria-label="In-page sections">
            {links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a href="#contact" className="btn-primary text-xs hidden sm:inline-flex">
            Let&apos;s talk
          </a>
        </motion.nav>
      </div>
    </header>
  );
};

// Generic section wrapper
interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, eyebrow, title, children }) => (
  <section id={id} className="space-y-4">
    <motion.div
      initial={{ y: 18, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ type: "spring", stiffness: 100, damping: 18 }}
    >
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-xl sm:text-2xl font-semibold text-slate-50">
        {title}
      </h2>
    </motion.div>
    {children}
  </section>
);

// Shared label for visual blocks
const BlockLabel: React.FC<{ text: string; variant?: "before" | "after" }> = ({
  text,
  variant = "before"
}) => (
  <p
    className={`text-[10px] font-medium uppercase tracking-wide mb-1.5 ${
      variant === "after" ? "text-emerald-400/90" : "text-slate-500"
    }`}
  >
    {text}
  </p>
);

// Visual before→process→after animation for each data pipeline step
const StepVisual: React.FC<{ stepIndex: number }> = ({ stepIndex }) => {
  if (stepIndex === 0) {
    return (
      <div className="h-36 flex flex-col items-center justify-center px-4">
        <div className="flex items-end gap-4 w-full justify-center">
          <div className="text-center">
            <BlockLabel text="Sources" />
            <div className="flex gap-2">
              <motion.div
                className="h-10 w-8 rounded bg-slate-600 border border-slate-600"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <motion.div
                className="h-8 w-6 rounded bg-slate-600 border border-slate-600"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
              />
            </div>
          </div>
          <motion.div
            className="flex flex-col gap-0.5 -mb-4"
            animate={{ x: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 rounded-full bg-brand-400"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.12 }}
              />
            ))}
          </motion.div>
          <div className="text-center">
            <BlockLabel text="Collected data" variant="after" />
            <motion.div
              className="h-14 w-16 rounded-lg border-2 border-brand-400/60 bg-slate-900/90 flex flex-wrap gap-1.5 p-2"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-2 w-2 rounded-full bg-brand-400"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, repeat: Infinity, repeatDelay: 2 }}
                />
              ))}
            </motion.div>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 mt-2">
          Logs and events flow into a central data pool
        </p>
      </div>
    );
  }

  if (stepIndex === 1) {
    return (
      <div className="h-36 flex flex-col items-center justify-center px-4">
        <div className="flex items-center gap-4 w-full justify-center">
          <div className="text-center">
            <BlockLabel text="Dirty data" />
            <div className="relative h-14 w-14 rounded border border-red-500/40 bg-slate-900/80 p-1">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${6 + (i % 4) * 10 + (i % 2) * 4}px`,
                    top: `${6 + Math.floor(i / 4) * 10 + (i % 2) * 5}px`,
                    width: 6,
                    height: 6,
                    backgroundColor: i % 4 === 0 ? "#ef4444" : "#94a3b8"
                  }}
                  animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.03 }}
                />
              ))}
            </div>
          </div>
          <motion.span
            className="text-slate-500 text-xl -mb-6"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            →
          </motion.span>
          <div className="text-center">
            <BlockLabel text="Clean data" variant="after" />
            <div className="grid grid-cols-4 gap-1.5 p-2 rounded-lg border border-emerald-500/40 bg-slate-900/80">
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-2.5 w-2.5 rounded-full bg-emerald-400"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.15 + i * 0.025,
                    repeat: Infinity,
                    repeatDelay: 2.2
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 mt-2">
          Messy points with errors → validated, structured grid
        </p>
      </div>
    );
  }

  if (stepIndex === 2) {
    const rawHeights = [10, 24, 6, 28, 14, 20];
    return (
      <div className="h-36 flex flex-col items-center justify-center px-4">
        <div className="flex items-end gap-5 w-full justify-center">
          <div className="text-center">
            <BlockLabel text="Raw columns" />
            <div className="flex items-end gap-1.5 h-12">
              {rawHeights.map((h, i) => (
                <motion.div
                  key={i}
                  className="w-4 rounded bg-slate-500"
                  animate={{ height: [h, h + 6, h] }}
                  transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.1 }}
                  style={{ height: h }}
                />
              ))}
            </div>
          </div>
          <motion.span
            className="text-slate-500 text-xl -mb-4"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            →
          </motion.span>
          <div className="text-center">
            <BlockLabel text="Features" variant="after" />
            <div className="flex items-end gap-1.5 h-12">
              {[1, 2, 3, 4, 5, 6].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-4 rounded bg-brand-400"
                  animate={{ height: [0, 24, 24] }}
                  transition={{
                    delay: 0.4 + i * 0.08,
                    duration: 0.6,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 mt-2">
          Uneven raw data → engineered signals for the model
        </p>
      </div>
    );
  }

  if (stepIndex === 3) {
    return (
      <div className="h-36 flex flex-col items-center justify-center px-4">
        <div className="flex items-center gap-5 w-full justify-center">
          <div className="text-center">
            <BlockLabel text="Labeled data" />
            <div className="flex flex-wrap gap-1.5 w-16">
              {[0, 1, 0, 1, 0, 1, 0, 1].map((label, i) => (
                <motion.div
                  key={i}
                  className="h-5 w-5 rounded-full"
                  style={{
                    backgroundColor: label === 1 ? "#22c55e" : "#3b82f6"
                  }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.06 }}
                />
              ))}
            </div>
          </div>
          <div className="text-center -mb-2">
            <BlockLabel text="Training" />
            <motion.div
              className="h-10 w-10 rounded-full border-2 border-brand-400 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
            >
              <span className="text-xs text-brand-300">⟳</span>
            </motion.div>
          </div>
          <div className="text-center">
            <BlockLabel text="Model" variant="after" />
            <motion.div
              className="h-12 w-14 rounded-lg border-2 border-emerald-400/80 bg-slate-900 flex items-center justify-center"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
            >
              <span className="text-xs text-emerald-400 font-semibold">model</span>
            </motion.div>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 mt-2">
          Data + labels → train → trained model
        </p>
      </div>
    );
  }

  if (stepIndex === 4) {
    return (
      <div className="h-36 flex flex-col items-center justify-center px-4">
        <div className="flex items-center gap-4 w-full justify-center">
          <div className="text-center">
            <BlockLabel text="Trained model" />
            <motion.div
              className="h-10 w-12 rounded-lg border border-slate-600 bg-slate-900 flex items-center justify-center mx-auto"
              animate={{ opacity: [0.85, 1, 0.85] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <span className="text-[10px] text-slate-400">model</span>
            </motion.div>
          </div>
          <motion.span
            className="text-slate-500 text-xl -mb-4"
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 0.9 }}
          >
            →
          </motion.span>
          <div className="text-center">
            <BlockLabel text="Live API" variant="after" />
            <motion.div
              className="h-14 w-16 rounded-lg border-2 border-brand-400/60 bg-slate-900/90 p-2.5 mx-auto"
              animate={{
                boxShadow: [
                  "0 0 0 transparent",
                  "0 0 16px rgba(34,211,238,0.5)",
                  "0 0 0 transparent"
                ]
              }}
              transition={{ repeat: Infinity, duration: 1.8 }}
            >
              <p className="text-[10px] text-brand-300 font-semibold">API</p>
              <div className="mt-2 flex gap-1.5 justify-center">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="h-2 w-2 rounded-full bg-emerald-400"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.1 }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 mt-2">
          Model deployed → live predictions + monitoring
        </p>
      </div>
    );
  }

  return null;
};

// Hero section – data science focused
const Hero: React.FC = () => {
  const steps = [
    { title: "Collect raw data", subtitle: "Logs · events · tables" },
    { title: "Clean and validate", subtitle: "Missing values · anomalies" },
    { title: "Build features", subtitle: "Signals for the model" },
    { title: "Train & test model", subtitle: "Offline experiments" },
    { title: "Deploy & monitor", subtitle: "Serving · dashboards" }
  ];

  const [currentStep, setCurrentStep] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3200);

    return () => window.clearInterval(id);
  }, [steps.length]);

  return (
    <section
      id="top"
      className="relative grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-center"
    >
      <div className="pointer-events-none absolute -inset-x-10 -top-32 -bottom-10 opacity-50 hero-grid" />

      <div className="relative space-y-8">
        <motion.div
          className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs text-slate-300"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
          <span>Open to Data Science / ML roles</span>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 14 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight">
            <span className="text-slate-300">I&apos;m</span>{" "}
            <span className="bg-gradient-to-r from-brand-300 via-sky-400 to-indigo-300 bg-clip-text text-transparent">
              Hanisha Mendu
            </span>
            <br />
            <span className="text-slate-200">
              Data Scientist &amp; ML Engineer.
            </span>
          </h1>
          <p className="max-w-xl text-sm sm:text-base text-slate-300 leading-relaxed">
            I turn messy, high-dimensional data into clear, measurable impact.
            I enjoy owning the full lifecycle: from defining the problem and
            getting the data, to experimenting, shipping models, and monitoring
            them in production.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center gap-3"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 90, damping: 13 }}
        >
          <a
            href="#projects"
            className="btn-primary"
            onClick={() =>
              trackEvent("cta_click", { location: "hero", label: "View projects" })
            }
          >
            View applied ML projects
          </a>
          <a
            href="/Data_Scientist_Hanisha.pdf"
            className="btn-ghost"
            download
            onClick={() =>
              trackEvent("cta_click", { location: "hero", label: "Download Resume" })
            }
          >
            Download Resume
          </a>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 gap-4 pt-4 text-xs text-slate-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard label="Models in production" value="5+" />
          <StatCard label="Core stack" value="Python · SQL · ML" />
          <StatCard label="Focus areas" value="Product analytics · ML systems" />
        </motion.div>
      </div>

      <motion.div
        className="relative"
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.25, type: "spring", stiffness: 90, damping: 16 }}
      >
        <div className="glass-panel rounded-3xl p-4 lg:p-6 shadow-2xl shadow-slate-950/70">
          <p className="text-xs font-medium text-slate-400 mb-2">
            From raw data to deployed model
          </p>

          <motion.div
            key={steps[currentStep].title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-[11px] uppercase tracking-wide text-brand-300 mb-1">
              Step {currentStep + 1} of {steps.length}
            </p>
            <p className="text-sm font-semibold text-slate-100">
              {steps[currentStep].title}
            </p>
            <p className="text-[11px] text-slate-400">{steps[currentStep].subtitle}</p>
          </motion.div>

          <div className="mt-3 min-h-[10rem] rounded-xl bg-slate-900/50 border border-slate-800/80 overflow-hidden">
            <StepVisual stepIndex={currentStep} />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-1.5">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  className="h-1.5 w-4 rounded-full"
                  animate={{
                    backgroundColor:
                      index === currentStep ? "rgba(56,189,248,1)" : "rgba(30,64,175,1)",
                    scale: index === currentStep ? 1.2 : 1
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />
              ))}
            </div>
            <p className="text-[10px] text-slate-500">
              Auto‑playing sequence of your workflow
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const StatCard: React.FC<{ label: string; value: string }> = ({
  label,
  value
}) => (
  <div className="space-y-1">
    <p className="text-[11px] uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="text-sm font-semibold text-slate-100">{value}</p>
  </div>
);

const HighlightCard: React.FC<{ label: string; value: string }> = ({
  label,
  value
}) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2">
    <p className="text-[11px] text-slate-400">{label}</p>
    <p className="text-xs font-medium text-slate-100">{value}</p>
  </div>
);

// Deep dive case study section
const DeepCaseStudy: React.FC = () => {
  return (
    <Section
      id="case-study"
      eyebrow="Flagship case study"
      title="Reducing churn with data-informed interventions"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
        <motion.div
          className="space-y-3 text-sm text-slate-300"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: "spring", stiffness: 95, damping: 18 }}
        >
          <p>
            A subscription product was seeing a steady increase in monthly
            churn. The goal was to proactively identify at-risk users and
            enable targeted outreach instead of reacting after they cancelled.
          </p>
          <p>
            I started by working with stakeholders to define a precise churn
            definition, then explored product telemetry, support tickets, and
            billing events to engineer features around engagement, feature
            usage, and payment behavior.
          </p>
          <p>
            After benchmarking several models (logistic regression, random
            forest, gradient boosting), I deployed an XGBoost model with
            calibrated probabilities and a decision policy that balanced
            precision and coverage.
          </p>
          <p>
            The result: a 15% churn reduction in the targeted segment over 3
            months, with clear monitoring dashboards and a plan for periodic
            retraining.
          </p>
        </motion.div>

        <motion.div
          className="glass-panel rounded-2xl p-4 space-y-4 text-xs text-slate-200"
          initial={{ x: 30, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: "spring", stiffness: 100, damping: 18 }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Experiment summary
          </p>
          <div className="grid grid-cols-3 gap-3">
            <MetricTile label="Baseline churn" value="8.1%" detail="3 mo. avg" />
            <MetricTile label="Post-model" value="6.9%" detail="target cohort" />
            <MetricTile label="Lift" value="‑15%" detail="relative reduction" />
          </div>

          <div className="mt-2">
            <p className="mb-2 text-[11px] text-slate-400">
              A/B test results (treatment vs. control)
            </p>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <span className="text-slate-400">Group</span>
              <span className="text-slate-400">Churn</span>
              <span className="text-slate-400 text-right">n</span>
              <span>Control</span>
              <span>8.0%</span>
              <span className="text-right">5,000</span>
              <span>Treatment</span>
              <span>6.8%</span>
              <span className="text-right">5,100</span>
            </div>
          </div>

          <p className="pt-1 text-[11px] text-slate-400">
            Built end-to-end: data extraction, feature engineering, modeling,
            evaluation, deployment, and monitoring.
          </p>
        </motion.div>
      </div>
    </Section>
  );
};

const MetricTile: React.FC<{
  label: string;
  value: string;
  detail?: string;
}> = ({ label, value, detail }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
    <p className="text-[11px] text-slate-400">{label}</p>
    <p className="text-sm font-semibold text-slate-50">{value}</p>
    {detail ? (
      <p className="text-[11px] text-slate-500 mt-0.5">{detail}</p>
    ) : null}
  </div>
);

// Timeline of experiments and iterations
const ExperimentTimeline: React.FC = () => {
  const steps = [
    {
      title: "Baseline analysis",
      detail: "Defined churn and built baseline metrics and cohort cuts."
    },
    {
      title: "Feature engineering",
      detail:
        "Derived engagement, recency, frequency, and payment features from raw logs."
    },
    {
      title: "Model exploration",
      detail:
        "Compared linear, tree-based, and gradient boosting models with cross‑validation."
    },
    {
      title: "A/B test",
      detail:
        "Launched experiment with treatment group receiving targeted outreach."
    },
    {
      title: "Monitoring & iteration",
      detail:
        "Set up dashboards, alerts, and a retraining schedule based on data drift."
    }
  ];

  return (
    <Section
      id="experiments"
      eyebrow="Experimentation"
      title="How I iterate on data products"
    >
      <ol className="relative border-slate-800/80 pl-4 before:absolute before:left-[7px] before:top-1 before:bottom-1 before:w-px before:bg-slate-800/60 space-y-4 text-sm text-slate-300">
        {steps.map((step, index) => (
          <motion.li
            key={step.title}
            className="relative pl-4"
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              delay: index * 0.06,
              type: "spring",
              stiffness: 95,
              damping: 18
            }}
          >
            <span className="absolute left-[-2px] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Step {index + 1}
            </p>
            <p className="font-medium text-slate-100">{step.title}</p>
            <p className="text-sm text-slate-300">{step.detail}</p>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
};

// "How I work" process
const ProcessSection: React.FC = () => {
  const steps = [
    {
      title: "Understand the problem",
      description:
        "Clarify the business question, constraints, and stakeholders. Align on success metrics up front."
    },
    {
      title: "Get and trust the data",
      description:
        "Explore sources, check data quality, and design a reliable pipeline instead of pulling ad‑hoc CSVs."
    },
    {
      title: "Experiment and model",
      description:
        "Start with simple baselines, then iterate with more complex models only when they add clear value."
    },
    {
      title: "Ship, monitor, iterate",
      description:
        "Integrate with product, add logging and dashboards, and revisit the model as product and data evolve."
    }
  ];

  return (
    <Section
      id="process"
      eyebrow="How I work"
      title="My end‑to‑end data science process"
    >
      <div className="grid gap-4 md:grid-cols-4 text-sm text-slate-300">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            className="glass-panel rounded-2xl p-4"
            initial={{ y: 18, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              delay: index * 0.06,
              type: "spring",
              stiffness: 110,
              damping: 18
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              0{index + 1}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-100">
              {step.title}
            </p>
            <p className="mt-2 text-xs text-slate-300">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

// Data science projects
const Projects: React.FC = () => {
  const projects = [
    {
      name: "User Churn Prediction",
      role: "End-to-end ML pipeline",
      impact:
        "Identified 30% of at-risk users with precision >0.8, driving a 15% churn reduction in targeted cohorts.",
      tech: ["Python", "Pandas", "scikit-learn", "XGBoost", "SQL"],
      description:
        "Designed features from product telemetry, trained and evaluated multiple models, and deployed the best model behind an internal API with regular retraining."
    },
    {
      name: "Recommendation System",
      role: "Ranking / Personalization",
      impact:
        "Lifted click-through-rate on recommended content by 12% through personalized ranking.",
      tech: ["Python", "NumPy", "Implicit", "FastAPI", "Redis"],
      description:
        "Implemented a hybrid collaborative-filtering system, built offline evaluation, and exposed a low-latency API for the product team."
    }
  ];

  return (
    <Section
      id="projects"
      eyebrow="Applied machine learning"
      title="Data projects with measurable impact"
    >
      <div className="space-y-4">
        {projects.map((project, idx) => (
          <motion.article
            key={project.name}
            className="glass-panel rounded-2xl p-4 md:p-5 cursor-pointer"
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            whileHover={{ y: -4, scale: 1.01 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              delay: idx * 0.07,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            onClick={() =>
              trackEvent("project_click", {
                name: project.name,
                location: "projects_section"
              })
            }
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <h3 className="text-base md:text-lg font-semibold text-slate-100">
                  {project.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {project.role}
                </p>
              </div>
              <p className="text-xs text-emerald-300/90 bg-emerald-500/10 rounded-full px-3 py-1">
                {project.impact}
              </p>
            </div>
            <p className="mt-3 text-sm text-slate-300">{project.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-300">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-slate-700/80 bg-slate-900/60 px-2.5 py-1"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
};

// MLOps & tooling
const MlOpsSection: React.FC = () => {
  const cards = [
    {
      title: "Data pipelines",
      items: ["Airflow", "dbt style transforms", "Automated quality checks"]
    },
    {
      title: "Deployment",
      items: ["FastAPI services", "Dockerized models", "CI/CD integration"]
    },
    {
      title: "Monitoring",
      items: ["Dashboards & alerts", "Data drift checks", "Post‑launch reviews"]
    }
  ];

  return (
    <Section
      id="mlops"
      eyebrow="MLOps & reliability"
      title="Thinking beyond the notebook"
    >
      <div className="grid gap-4 md:grid-cols-3 text-sm text-slate-300">
        {cards.map((card, idx) => (
          <motion.div
            key={card.title}
            className="glass-panel rounded-2xl p-4"
            initial={{ y: 18, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              delay: idx * 0.05,
              type: "spring",
              stiffness: 105,
              damping: 18
            }}
          >
            <p className="text-sm font-semibold text-slate-100">{card.title}</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-300">
              {card.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

// Experience
const Experience: React.FC = () => {
  const experience = [
    {
      company: "Data-focused role / internship",
      title: "Data Scientist / ML Engineer",
      period: "2023 — Present",
      bullets: [
        "Worked with product and engineering to define success metrics and run experiments.",
        "Built data pipelines that transformed raw logs into clean features for modeling.",
        "Communicated results with clear visuals and actionable recommendations."
      ]
    },
    {
      company: "Academic / personal projects",
      title: "Research / Project work",
      period: "2021 — 2023",
      bullets: [
        "Explored supervised, unsupervised, and deep learning techniques on real datasets.",
        "Collaborated in small teams with shared Git workflows and code reviews.",
        "Documented experiments and findings in notebooks and project reports."
      ]
    }
  ];

  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="How I’ve applied data and ML"
    >
      <div className="space-y-4">
        {experience.map((job, idx) => (
          <motion.div
            key={job.company}
            className="glass-panel rounded-2xl p-4 md:p-5"
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              delay: idx * 0.08,
              type: "spring",
              stiffness: 100,
              damping: 17
            }}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-100">
                  {job.title}
                </h3>
                <p className="text-sm text-slate-300">{job.company}</p>
              </div>
              <p className="text-xs text-slate-400">{job.period}</p>
            </div>

            <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm text-slate-300">
              {job.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

// Skills – focused on data stack
const Skills: React.FC = () => {
  const skillGroups = [
    {
      label: "Data & analysis",
      items: ["Python", "Pandas", "NumPy", "SQL", "Matplotlib", "Seaborn"]
    },
    {
      label: "Machine learning",
      items: [
        "scikit-learn",
        "XGBoost",
        "TensorFlow / PyTorch",
        "Feature engineering",
        "Model evaluation"
      ]
    },
    {
      label: "Production & tooling",
      items: ["Git", "FastAPI", "Docker", "Airflow", "Data pipelines", "Dashboards"]
    }
  ];

  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="What I use to ship data products"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {skillGroups.map((group, idx) => (
          <motion.div
            key={group.label}
            className="glass-panel rounded-2xl p-4"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              delay: idx * 0.06,
              type: "spring",
              stiffness: 110,
              damping: 18
            }}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {group.label}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5 text-xs text-slate-200">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-slate-900/70 border border-slate-700/80 px-2.5 py-1"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

// Analysis & chart-like visualizations
const AnalysisShowcase: React.FC = () => {
  const importances = [
    { feature: "Recent sessions", weight: 0.9 },
    { feature: "Feature usage depth", weight: 0.75 },
    { feature: "Payment failures", weight: 0.6 },
    { feature: "Support tickets", weight: 0.45 }
  ];

  return (
    <Section
      id="analysis"
      eyebrow="Analysis"
      title="Making data and models interpretable"
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <motion.div
          className="glass-panel rounded-2xl p-4"
          initial={{ y: 18, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: "spring", stiffness: 105, damping: 18 }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Feature importance snapshot
          </p>
          <div className="mt-3 space-y-2 text-xs text-slate-200">
            {importances.map((item) => (
              <div key={item.feature}>
                <div className="flex justify-between mb-1">
                  <span>{item.feature}</span>
                  <span className="text-slate-400">
                    {Math.round(item.weight * 100)}%
                  </span>
                </div>
                <motion.div
                  className="h-2 rounded-full bg-slate-800 overflow-hidden"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.8 }}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-400 to-emerald-400"
                    style={{ width: `${item.weight * 100}%` }}
                  />
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="glass-panel rounded-2xl p-4 text-xs text-slate-200 space-y-3"
          initial={{ y: 18, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 105, damping: 18 }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Model performance snapshot
          </p>
          <p>
            For classification problems, I focus on precision/recall trade-offs,
            calibration, and how decision thresholds affect business outcomes
            rather than just a single accuracy number.
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <p className="text-slate-400">Offline metrics</p>
              <p>AUC: 0.86</p>
              <p>Precision@k: 0.82</p>
              <p>Recall@k: 0.71</p>
            </div>
            <div>
              <p className="text-slate-400">Online impact</p>
              <p>Churn: -15%</p>
              <p>Opt‑in rate: +9%</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

// Public work links (GitHub, Kaggle, etc.)
const PublicWork: React.FC = () => {
  const items = [
    {
      label: "GitHub",
      detail: "Code for ML & data projects.",
      href: "https://github.com/hanishaaa"
    },
    {
      label: "Kaggle / competitions",
      detail: "Selected notebooks and competition entries.",
      href: "https://www.kaggle.com/your-handle"
    },
    {
      label: "Writing",
      detail: "Posts explaining experiments and learnings.",
      href: "https://your-blog-or-medium.com"
    }
  ];

  return (
    <Section
      id="public"
      eyebrow="Public work"
      title="Where you can see my work"
    >
      <div className="grid gap-4 md:grid-cols-3 text-sm text-slate-300">
        {items.map((item) => (
          <motion.a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="glass-panel rounded-2xl p-4 hover:border-brand-400/70 hover:shadow-glow transition-all"
            initial={{ y: 18, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ type: "spring", stiffness: 110, damping: 18 }}
            onClick={() =>
              trackEvent("public_link_click", {
                label: item.label
              })
            }
          >
            <p className="text-sm font-semibold text-slate-100">
              {item.label}
            </p>
            <p className="mt-1 text-xs text-slate-300">{item.detail}</p>
          </motion.a>
        ))}
      </div>
    </Section>
  );
};

// Simple testimonials / quotes
const Testimonials: React.FC = () => {
  const quotes = [
    {
      name: "Manager / Mentor",
      role: "Senior Engineer",
      quote:
        "Hanisha consistently dug into the data until we had answers we trusted, then communicated findings clearly to non‑technical teammates."
    },
    {
      name: "Teammate",
      role: "Product Manager",
      quote:
        "She translated ambiguous product questions into concrete experiments with clear success metrics. Working together felt fast and low‑friction."
    }
  ];

  return (
    <Section
      id="testimonials"
      eyebrow="Feedback"
      title="What it’s like to work with me"
    >
      <div className="grid gap-4 md:grid-cols-2 text-sm text-slate-300">
        {quotes.map((q, idx) => (
          <motion.figure
            key={q.name}
            className="glass-panel rounded-2xl p-4"
            initial={{ y: 18, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              delay: idx * 0.06,
              type: "spring",
              stiffness: 110,
              damping: 18
            }}
          >
            <blockquote className="text-sm text-slate-200 leading-relaxed">
              “{q.quote}”
            </blockquote>
            <figcaption className="mt-3 text-xs text-slate-400">
              {q.name} · {q.role}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </Section>
  );
};

// Contact / call-to-action
const Contact: React.FC = () => {
  return (
    <Section
      id="contact"
      eyebrow="Next steps"
      title="Let’s build data-driven products"
    >
      <motion.div
        className="glass-panel rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ type: "spring", stiffness: 90, damping: 16 }}
      >
        <div>
          <p className="text-sm text-slate-200">
            I&apos;m looking for teams where data is central to the product
            strategy—whether that&apos;s recommendations, risk, growth, or core
            analytics.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Ideal roles: Data Scientist, ML Engineer, or Analytics Engineer
            with close collaboration across product, design, and engineering.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <a
            href="mailto:your.email@example.com"
            className="btn-primary w-full md:w-auto text-center"
            onClick={() =>
              trackEvent("cta_click", { location: "contact", label: "Email me" })
            }
          >
            Email me
          </a>
          <div className="flex flex-wrap gap-3 text-xs text-slate-300">
            <a
              href="https://www.linkedin.com/in/hanisha-mendu"
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-300"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/hanishaaa"
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-300"
            >
              GitHub
            </a>
            <a
              href="#top"
              className="text-slate-500 hover:text-slate-200 underline-offset-4 hover:underline"
            >
              Back to top
            </a>
          </div>
        </div>
      </motion.div>
    </Section>
  );
};

export default App;