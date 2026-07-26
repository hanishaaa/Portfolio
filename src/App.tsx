import React from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion
} from "framer-motion";

const RESUME_FILE = "/Hanisha_Mendu_Data_Scientist.pdf";
const EMAIL = "hanishamendums@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/hanisha-mendu";
const GITHUB = "https://github.com/hanishaaa";

// The ID from the Formspree endpoint https://formspree.io/f/<id>. If this is ever
// emptied, the message form is replaced by an email fallback rather than rendering a
// send button that cannot work.
const FORMSPREE_ID = "xeeypdky";

const App: React.FC = () => {
  const [messageOpen, setMessageOpen] = React.useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-slate-950 text-slate-50 gradient-ring">
        <Navbar onOpenMessage={() => setMessageOpen(true)} />
        <main className="section-container pt-28 pb-20 space-y-24">
          <Hero />
          <Projects />
          <Experience />
          <Education />
          <Skills />
          <Contact />
        </main>
        <MessageModal open={messageOpen} onClose={() => setMessageOpen(false)} />
      </div>
    </MotionConfig>
  );
};

// Top navbar
const Navbar: React.FC<{ onOpenMessage: () => void }> = ({ onOpenMessage }) => {
  const links = [
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" }
  ];

  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <div className="section-container py-4">
        <motion.nav
          className="glass-panel rounded-2xl px-4 py-3"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          aria-label="Primary"
        >
          <div className="flex items-center justify-between">
            <a
              href="#top"
              className="flex items-center gap-2 text-sm font-semibold tracking-tight"
            >
              <span className="h-7 w-7 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-300 text-xs font-bold">
                HM
              </span>
              <span className="text-slate-100">Hanisha Mendu</span>
            </a>

            <div className="hidden md:flex items-center gap-1 text-xs">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className="px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <button
              type="button"
              onClick={onOpenMessage}
              className="btn-primary text-xs hidden md:inline-flex"
            >
              Let&apos;s talk
            </button>

            <button
              type="button"
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-800/70 transition-colors"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span aria-hidden="true" className="text-base leading-none">
                {menuOpen ? "✕" : "☰"}
              </span>
            </button>
          </div>

          {menuOpen ? (
            <div
              id="mobile-menu"
              className="md:hidden mt-3 flex flex-col gap-1 border-t border-slate-800/80 pt-3 text-sm"
            >
              {links.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className="rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenMessage();
                }}
                className="btn-primary mt-2 w-full text-xs"
              >
                Let&apos;s talk
              </button>
            </div>
          ) : null}
        </motion.nav>
      </div>
    </header>
  );
};

type SendStatus = "idle" | "sending" | "sent" | "error";

// Quick-message modal opened from the navbar. Deliberately distinct from the Contact
// section, which hands over email / LinkedIn / CV for people who prefer their own client.
const MessageModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose
}) => {
  const [status, setStatus] = React.useState<SendStatus>("idle");
  const [errorMessage, setErrorMessage] = React.useState("");
  const firstFieldRef = React.useRef<HTMLInputElement>(null);

  // Escape to close, lock background scroll, move focus in and hand it back on close.
  React.useEffect(() => {
    if (!open) return;

    setStatus("idle");
    setErrorMessage("");

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: bots fill hidden fields, people never see this one.
    if (data.get("_gotcha")) return;

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message")
        })
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.errors?.[0]?.message ?? "That didn't send. Please try again."
        );
      }

      form.reset();
      setStatus("sent");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "That didn't send. Please try again."
      );
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="message-modal-title"
            className="glass-panel relative w-full max-w-md rounded-2xl p-5 shadow-2xl shadow-slate-950/80"
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="message-modal-title"
                  className="text-base font-semibold text-slate-100"
                >
                  Send me a message
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Goes straight to my inbox — no account needed.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="-mr-1 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800/70 hover:text-slate-100 transition-colors"
                aria-label="Close"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </div>

            {!FORMSPREE_ID ? (
              <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/70 p-4 text-sm text-slate-300">
                <p>The message form isn&apos;t connected yet.</p>
                <p className="mt-2">
                  In the meantime, email me at{" "}
                  <a
                    href={`mailto:${EMAIL}`}
                    className="text-brand-300 hover:underline"
                  >
                    {EMAIL}
                  </a>{" "}
                  or reach me on{" "}
                  <a
                    href={LINKEDIN}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-300 hover:underline"
                  >
                    LinkedIn
                  </a>
                  .
                </p>
              </div>
            ) : status === "sent" ? (
              <div
                className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-slate-200"
                role="status"
              >
                <p className="font-medium text-emerald-300">Message sent.</p>
                <p className="mt-2 text-slate-300">
                  I&apos;ll reply within a couple of days. If you don&apos;t hear
                  back, email me directly at{" "}
                  <a
                    href={`mailto:${EMAIL}`}
                    className="text-brand-300 hover:underline"
                  >
                    {EMAIL}
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-ghost mt-4 w-full text-xs"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <div>
                  <label htmlFor="message-name" className="field-label">
                    Name
                  </label>
                  <input
                    ref={firstFieldRef}
                    id="message-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className="field-input"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="message-email" className="field-label">
                    Email
                  </label>
                  <input
                    id="message-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="field-input"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="message-body" className="field-label">
                    Message
                  </label>
                  <textarea
                    id="message-body"
                    name="message"
                    required
                    rows={4}
                    className="field-input resize-y"
                    placeholder="A line about the role or what you're working on."
                  />
                </div>

                <input
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />

                {status === "error" ? (
                  <p className="text-xs text-red-300" role="alert">
                    {errorMessage}{" "}
                    <a
                      href={`mailto:${EMAIL}`}
                      className="underline hover:text-red-200"
                    >
                      Or email me directly.
                    </a>
                  </p>
                ) : null}

                <button
                  type="submit"
                  className="btn-primary w-full text-sm disabled:opacity-60"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
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
  <section id={id} className="space-y-4 scroll-mt-28">
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
        <div className="flex items-center gap-4 w-full justify-center">
          <div className="text-center">
            <BlockLabel text="Sources" />
            <div className="flex items-end justify-center gap-2 h-[52px]">
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
            className="flex flex-col gap-1 -mb-4"
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
              className="grid grid-cols-4 gap-1.5 p-2 rounded-lg border-2 border-brand-400/60 bg-slate-900/90"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              {[...Array(12)].map((_, i) => (
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
            <BlockLabel text="Monitored in use" variant="after" />
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
              <p className="text-[10px] text-brand-300 font-semibold">live</p>
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
          Model in use → predictions tracked and monitored
        </p>
      </div>
    );
  }

  return null;
};

const HERO_STEPS = [
  { title: "Collect raw data", subtitle: "Logs · events · tables" },
  { title: "Clean and validate", subtitle: "Missing values · anomalies" },
  { title: "Build features", subtitle: "Signals for the model" },
  { title: "Train & evaluate", subtitle: "Offline experiments" },
  { title: "Deploy & monitor", subtitle: "Serving · dashboards" }
];

// Hero section
const Hero: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (reduceMotion) return;

    const id = window.setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % HERO_STEPS.length);
    }, 3200);

    return () => window.clearInterval(id);
  }, [reduceMotion]);

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
          <span>Open to Data Science / ML roles · Brighton, UK</span>
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
            <span className="text-slate-200">Data Scientist.</span>
          </h1>
          <p className="max-w-xl text-sm sm:text-base text-slate-300 leading-relaxed">
            Three years of working with operational and performance data taught
            me that the value sits in the decision it changes, not the model
            itself. An MSc in Data Science added the modelling depth — financial
            risk, behavioural analytics, and forecasting — on top of the
            stakeholder side I already knew.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center gap-3"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 90, damping: 13 }}
        >
          <a href="#projects" className="btn-primary">
            View projects
          </a>
          <a href={RESUME_FILE} className="btn-ghost" download>
            Download CV
          </a>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 text-xs text-slate-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard label="Analytics experience" value="3+ years" />
          <StatCard label="Education" value="MSc Data Science, Sussex" />
          <StatCard label="Core stack" value="Python · SQL · PyTorch" />
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
            How I approach an end-to-end problem
          </p>

          <motion.div
            key={HERO_STEPS[currentStep].title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-[11px] uppercase tracking-wide text-brand-300 mb-1">
              Step {currentStep + 1} of {HERO_STEPS.length}
            </p>
            <p className="text-sm font-semibold text-slate-100">
              {HERO_STEPS[currentStep].title}
            </p>
            <p className="text-[11px] text-slate-400">
              {HERO_STEPS[currentStep].subtitle}
            </p>
          </motion.div>

          <div className="mt-3 min-h-[10rem] rounded-xl bg-slate-900/50 border border-slate-800/80 overflow-hidden">
            <StepVisual stepIndex={currentStep} />
          </div>

          <div className="mt-4 flex gap-1.5">
            {HERO_STEPS.map((step, index) => (
              <button
                key={step.title}
                type="button"
                onClick={() => setCurrentStep(index)}
                className="group py-1.5"
                aria-label={`Show step ${index + 1}: ${step.title}`}
                aria-current={index === currentStep}
              >
                <motion.span
                  className="block h-1.5 w-4 rounded-full"
                  animate={{
                    backgroundColor:
                      index === currentStep
                        ? "rgba(56,189,248,1)"
                        : "rgba(30,64,175,1)",
                    scale: index === currentStep ? 1.2 : 1
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />
              </button>
            ))}
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
    <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
    <p className="text-sm font-semibold text-slate-100">{value}</p>
  </div>
);

// Data science projects
const Projects: React.FC = () => {
  // Add `repo: "https://github.com/..."` to any project to render a "View code" link.
  const projects: {
    name: string;
    role: string;
    impact: string;
    tech: string[];
    description: string;
    repo?: string;
  }[] = [
    {
      name: "Self-Supervised Behavioural Representation Learning",
      role: "Representation learning / unsupervised",
      impact:
        "Identified 23 behavioural patterns across 540,000+ time-series records without labelled data.",
      tech: [
        "Python",
        "PyTorch",
        "1D CNN Autoencoder",
        "MiniBatchKMeans",
        "t-SNE / UMAP"
      ],
      description:
        "Built an end-to-end pipeline turning raw movement data into structured features, learned latent representations with a 1D CNN autoencoder, and evaluated embedding quality with dimensionality reduction and similarity metrics. Structured for scalability and reproducibility, ready for real-time behavioural monitoring."
    },
    {
      name: "Amazon Sales Performance Dashboard",
      role: "Business intelligence / analytics",
      impact:
        "Centralised revenue, profit, order volume, and product performance into one self-service reporting view.",
      tech: ["Power BI", "Power Query", "DAX", "Data Modelling"],
      description:
        "Cleaned, transformed, and modelled raw Amazon sales data into reliable reporting views for accurate KPI tracking across business dimensions. Analysed purchasing behaviour, sales trends, and category performance to surface key business drivers — delivering visualisations that sped up decisions and cut reliance on manual reporting."
    },
    {
      name: "Fraud Detection Modelling",
      role: "Imbalanced classification / financial risk",
      impact:
        "Tuned precision, recall, F1 and ROC-AUC to balance fraud capture against customer experience.",
      tech: ["Python", "scikit-learn", "XGBoost", "Random Forest", "SMOTE"],
      description:
        "Developed predictive models on highly imbalanced credit card transaction data using SMOTE for class balancing, with production-oriented evaluation metrics reflecting real operational fraud trade-offs and a hypothesis-driven approach to isolating fraudulent patterns."
    },
    {
      name: "Crop Yield Prediction",
      role: "Predictive modelling / multi-source data",
      impact:
        "MLP model reached R² ≈ 0.95, generalising across geographies on ~68k records.",
      tech: ["Python", "SQL", "MLP", "Feature Engineering"],
      description:
        "Built a predictive modelling pipeline integrating 17 multi-source datasets with SQL-based preprocessing, then improved robustness through feature engineering, validation, and structured experimentation."
    }
  ];

  return (
    <Section
      id="projects"
      eyebrow="Applied data science"
      title="Data projects with measurable impact"
    >
      <div className="space-y-4">
        {projects.map((project, idx) => (
          <motion.article
            key={project.name}
            className="glass-panel rounded-2xl p-4 md:p-5"
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              delay: idx * 0.07,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
          >
            <h3 className="text-base md:text-lg font-semibold text-slate-100">
              {project.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{project.role}</p>
            <p className="mt-3 rounded-lg border-l-2 border-emerald-400/70 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200/90">
              {project.impact}
            </p>
            <p className="mt-3 text-sm text-slate-300">{project.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-slate-700/80 bg-slate-900/60 px-2.5 py-1"
                >
                  {t}
                </span>
              ))}
              {project.repo ? (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-brand-400/60 px-2.5 py-1 text-brand-300 hover:bg-brand-400/10 transition-colors"
                >
                  View code →
                </a>
              ) : null}
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
};

// Experience
const Experience: React.FC = () => {
  const experience = [
    {
      company: "Wipro Limited",
      location: "Hyderabad, India",
      title: "Data & Analytics Analyst (PMO)",
      period: "Aug 2021 — Present",
      bullets: [
        "Applied data-driven analytical frameworks across 7+ global programmes, improving delivery performance by 15% through better visibility and insight generation.",
        "Queried and analysed large operational datasets in SQL and Excel to surface trends, anomalies and performance bottlenecks across project portfolios.",
        "Designed hypothesis-driven analyses to investigate delivery risks and validate performance assumptions, supporting data-informed decisions.",
        "Built Power BI dashboards translating complex multi-source data into actionable insight for senior stakeholders.",
        "Worked with cross-functional teams to define KPIs and turn business problems into structured analytical requirements.",
        "Automated reporting workflows and built scalable data pipelines to improve data quality, consistency and reporting efficiency.",
        "Communicated findings clearly to non-technical stakeholders, influencing strategic and operational decisions."
      ]
    }
  ];

  return (
    <Section id="experience" eyebrow="Experience" title="Where I've applied it">
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
                <p className="text-sm text-slate-300">
                  {job.company} · {job.location}
                </p>
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

// Education & certifications
const Education: React.FC = () => {
  const degrees = [
    {
      school: "University of Sussex",
      award: "MSc Data Science",
      period: "2024 — 2025"
    },
    {
      school: "Vignan Institute of Engineering for Women",
      award: "B.Tech, Electronics & Communication Engineering",
      period: ""
    }
  ];

  const certifications = [
    "GCP AI & ML",
    "Microsoft Azure Fundamentals (AZ-900)",
    "Data Analytics — KPMG",
    "Agile — JP Morgan"
  ];

  return (
    <Section id="education" eyebrow="Education" title="Study and certifications">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
        <div className="space-y-4">
          {degrees.map((degree, idx) => (
            <motion.div
              key={degree.school}
              className="glass-panel rounded-2xl p-4"
              initial={{ y: 18, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                delay: idx * 0.06,
                type: "spring",
                stiffness: 105,
                damping: 18
              }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-100">
                    {degree.award}
                  </h3>
                  <p className="text-sm text-slate-300">{degree.school}</p>
                </div>
                {degree.period ? (
                  <p className="text-xs text-slate-400">{degree.period}</p>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="glass-panel rounded-2xl p-4"
          initial={{ y: 18, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 105, damping: 18 }}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Certifications
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
            {certifications.map((cert) => (
              <li key={cert} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                <span>{cert}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </Section>
  );
};

// Skills – mirrors the CV tech stack
const Skills: React.FC = () => {
  const skillGroups = [
    {
      label: "Programming & analysis",
      items: ["Python", "Pandas", "NumPy", "SQL", "Jupyter"]
    },
    {
      label: "Machine learning",
      items: [
        "scikit-learn",
        "PyTorch",
        "TensorFlow",
        "Supervised & unsupervised",
        "Model selection & evaluation"
      ]
    },
    {
      label: "Statistics & experimentation",
      items: [
        "Hypothesis testing",
        "A/B testing",
        "Experimental design",
        "Probability",
        "Feature engineering"
      ]
    },
    {
      label: "Advanced ML",
      items: [
        "NLP",
        "Time series forecasting",
        "Recommendation systems",
        "Representation learning",
        "Generative AI concepts"
      ]
    },
    {
      label: "Deployment & MLOps",
      items: [
        "ETL pipelines",
        "Model monitoring",
        "Multi-source integration",
        "Workflow automation",
        "GCP AI Platform"
      ]
    },
    {
      label: "Visualisation & cloud",
      items: ["Power BI", "Tableau", "Matplotlib", "GCP", "Azure"]
    }
  ];

  return (
    <Section id="skills" eyebrow="Skills" title="Tech stack">
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

// Contact / call-to-action
const Contact: React.FC = () => {
  return (
    <Section id="contact" eyebrow="Next steps" title="Get in touch">
      <motion.div
        className="glass-panel rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ type: "spring", stiffness: 90, damping: 16 }}
      >
        <div>
          <p className="text-sm text-slate-200">
            I&apos;m looking for Data Scientist, ML Engineer or Analytics roles
            where the work sits close to the decisions it informs.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Brighton, UK · Open to relocation · Full-time UK work permit
          </p>
        </div>

        <div className="space-y-2 text-sm shrink-0">
          <a
            href={`mailto:${EMAIL}`}
            className="btn-primary w-full md:w-auto text-center"
          >
            Email me
          </a>
          <div className="flex flex-wrap gap-3 text-xs text-slate-300">
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-300"
            >
              LinkedIn
            </a>
            <a
              href={GITHUB}
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-300"
            >
              GitHub
            </a>
            <a href={RESUME_FILE} download className="hover:text-brand-300">
              CV
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
