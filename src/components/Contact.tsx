"use client";

import { FormEvent, useState } from "react";

interface FormState {
  name: string;
  email: string;
  message: string;
}

const INITIAL_FORM: FormState = { name: "", email: "", message: "" };

const PAPER_DOT_BG = "radial-gradient(rgba(26,26,26,0.09) 1px, transparent 1.4px)";
const PAPER_DOT_SIZE = "14px 14px";

function StarStamp() {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 100 100"
      aria-hidden
      style={{
        transform: "rotate(-14deg)",
        filter: "drop-shadow(3px 3px 0 var(--color-ink))",
      }}
    >
      <polygon
        points="50,4 58,18 74,10 72,28 90,26 80,40 96,50 80,58 92,72 74,72 82,88 64,82 62,98 50,86 38,98 36,82 18,88 26,72 8,72 24,58 8,50 24,40 14,26 32,28 30,10 46,18"
        fill="var(--color-gold)"
        stroke="var(--color-ink)"
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        fontFamily="var(--font-jp), var(--font-tattoo), sans-serif"
        fontWeight={900}
        fontSize="22"
        fill="var(--color-ink)"
      >
        購読
      </text>
      <text
        x="50"
        y="70"
        textAnchor="middle"
        fontFamily="var(--font-tattoo), sans-serif"
        fontWeight={700}
        fontSize="14"
        fill="var(--color-crimson)"
      >
        SUB
      </text>
    </svg>
  );
}

export function Contact() {
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Contact form submitted:", formState);
  };

  const handleNewsletter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Newsletter signup:", newsletterEmail);
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    background: "var(--color-paper)",
    border: "2.5px solid var(--color-ink)",
    boxShadow: "3px 3px 0 var(--color-ink)",
    fontFamily: "var(--font-sans), sans-serif",
    fontSize: 15,
    color: "var(--color-ink)",
    outline: "none",
    borderRadius: 0,
  } as const;

  const labelStyle = {
    display: "block",
    fontFamily: "var(--font-mono), monospace",
    fontSize: 10,
    letterSpacing: "0.3em",
    fontWeight: 800,
    color: "var(--color-ink-soft)",
    marginBottom: 4,
  } as const;

  const jpLabelStyle = {
    fontFamily: "var(--font-jp), var(--font-tattoo), sans-serif",
    fontSize: 14,
    color: "var(--color-crimson)",
    marginLeft: 6,
  } as const;

  return (
    <section
      id="contact"
      className="relative w-full"
      style={{
        background: "var(--color-paper)",
        backgroundImage: PAPER_DOT_BG,
        backgroundSize: PAPER_DOT_SIZE,
        borderBottom: "3px solid var(--color-ink)",
      }}
    >
      <div className="mx-auto max-w-6xl px-7 py-12 sm:px-10 sm:py-16">
        {/* Chip */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span
            className="inline-flex items-center justify-center"
            style={{
              background: "var(--color-teal)",
              color: "var(--color-ink)",
              border: "3px solid var(--color-ink)",
              boxShadow: "3px 3px 0 var(--color-ink)",
              padding: "6px 14px",
              fontFamily: "var(--font-tattoo), sans-serif",
              fontSize: 14,
              letterSpacing: "0.14em",
              lineHeight: 1,
            }}
          >
            SUBSCRIBE
          </span>
          <span
            style={{
              fontFamily: "var(--font-jp), var(--font-tattoo), sans-serif",
              fontSize: 22,
              color: "var(--color-teal)",
              lineHeight: 1,
            }}
          >
            連絡
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.3em",
              fontWeight: 800,
              color: "var(--color-ink-soft)",
            }}
          >
            — GET IN TOUCH
          </span>
        </div>

        {/* Heading */}
        <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
          <h2
            className="leading-[0.88]"
            style={{
              fontFamily: "var(--font-tattoo), sans-serif",
              fontSize: "clamp(3rem, 10vw, 7rem)",
              color: "var(--color-ink)",
            }}
          >
            LET&apos;S TALK
          </h2>
          <span
            style={{
              fontFamily: "var(--font-jp), var(--font-tattoo), sans-serif",
              fontSize: "clamp(1.5rem, 4.5vw, 3rem)",
              color: "var(--color-teal)",
              lineHeight: 1,
            }}
          >
            / 連絡
          </span>
        </div>

        {/* Body grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {/* Left — Direct message */}
          <div
            className="relative"
            style={{
              background: "#ECE4D0",
              backgroundImage: PAPER_DOT_BG,
              backgroundSize: PAPER_DOT_SIZE,
              border: "3px solid var(--color-ink)",
              boxShadow: "5px 5px 0 var(--color-crimson), 5px 5px 0 2px var(--color-ink)",
              padding: "28px 24px 24px",
            }}
          >
            <div
              className="mb-5 flex items-center"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.3em",
                fontWeight: 800,
                color: "var(--color-ink)",
              }}
            >
              DIRECT MESSAGE
              <span style={jpLabelStyle}>手紙</span>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label style={labelStyle}>
                  NAME<span style={jpLabelStyle}>名前</span>
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={formState.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  EMAIL<span style={jpLabelStyle}>メール</span>
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={formState.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  MESSAGE<span style={jpLabelStyle}>本文</span>
                </label>
                <textarea
                  placeholder="What's on your mind?"
                  rows={3}
                  value={formState.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  style={{ ...inputStyle, resize: "none" }}
                />
              </div>
              <button
                type="submit"
                className="self-start"
                style={{
                  padding: "12px 22px",
                  background: "var(--color-ink)",
                  color: "var(--color-paper)",
                  border: "3px solid var(--color-ink)",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 12,
                  letterSpacing: "0.24em",
                  fontWeight: 800,
                  lineHeight: 1,
                  cursor: "pointer",
                  boxShadow: "3px 3px 0 var(--color-crimson)",
                }}
              >
                SEND →
              </button>
            </form>
          </div>

          {/* Right — Subscribe + Elsewhere stack */}
          <div className="flex flex-col gap-6">
            <div
              className="relative"
              style={{
                background: "var(--color-royal)",
                border: "3px solid var(--color-ink)",
                boxShadow: "5px 5px 0 var(--color-gold), 5px 5px 0 2px var(--color-ink)",
                padding: "26px 24px 22px",
              }}
            >
              <div className="pointer-events-none absolute" style={{ top: -22, right: -18 }}>
                <StarStamp />
              </div>
              <div
                className="mb-3 flex items-center"
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  fontWeight: 800,
                  color: "var(--color-paper)",
                }}
              >
                VOL.02 NOTIFY
                <span
                  style={{
                    fontFamily: "var(--font-jp), var(--font-tattoo), sans-serif",
                    fontSize: 16,
                    color: "var(--color-gold)",
                    marginLeft: 8,
                  }}
                >
                  次号
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontSize: 16,
                  fontStyle: "italic",
                  color: "var(--color-paper)",
                  opacity: 0.9,
                  marginBottom: 18,
                }}
              >
                Get notified when the next drop opens. No spam, no fluff.
              </p>
              <form onSubmit={handleNewsletter} className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    background: "var(--color-paper)",
                    border: "2px solid var(--color-ink)",
                    fontFamily: "var(--font-sans), sans-serif",
                    fontSize: 14,
                    color: "var(--color-ink)",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "10px 18px",
                    background: "var(--color-gold)",
                    color: "var(--color-ink)",
                    border: "2px solid var(--color-ink)",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 11,
                    letterSpacing: "0.22em",
                    fontWeight: 800,
                    lineHeight: 1,
                    cursor: "pointer",
                    boxShadow: "3px 3px 0 var(--color-ink)",
                  }}
                >
                  NOTIFY ME
                </button>
              </form>
            </div>

            <div
              style={{
                background: "#ECE4D0",
                backgroundImage: PAPER_DOT_BG,
                backgroundSize: PAPER_DOT_SIZE,
                border: "3px solid var(--color-ink)",
                boxShadow: "5px 5px 0 var(--color-ink)",
                padding: "22px 24px",
              }}
            >
              <div
                className="mb-3 flex items-center"
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  fontWeight: 800,
                  color: "var(--color-ink)",
                }}
              >
                ELSEWHERE
                <span style={jpLabelStyle}>他</span>
              </div>
              <a
                href="https://www.instagram.com/tony.decay"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-2 inline-flex items-center gap-2"
                style={{
                  fontFamily: "var(--font-sans), sans-serif",
                  fontSize: 16,
                  color: "var(--color-ink)",
                  borderBottom: "2px solid var(--color-crimson)",
                  paddingBottom: 2,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
                @tony.decay
              </a>
              <br />
              <a
                href="mailto:contact@tonydecay.com"
                className="mt-2 inline-block"
                style={{
                  fontFamily: "var(--font-sans), sans-serif",
                  fontSize: 16,
                  color: "var(--color-ink)",
                  borderBottom: "2px solid var(--color-royal)",
                  paddingBottom: 2,
                }}
              >
                contact@tonydecay.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
