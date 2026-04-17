"use client";

import { FormEvent, useState } from "react";

interface FormState {
  name: string;
  email: string;
  message: string;
}

const INITIAL_FORM: FormState = { name: "", email: "", message: "" };

export function Contact() {
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // eslint-disable-next-line no-console
    console.log("Contact form submitted:", formState);
    // TODO: hook up to backend (Resend)
  };

  const handleNewsletter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // eslint-disable-next-line no-console
    console.log("Newsletter signup:", newsletterEmail);
    // TODO: hook up to backend
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section
      id="contact"
      className="bg-paper border-b-2 border-ink relative overflow-hidden py-20 sm:py-28"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section label */}
        <div className="inline-block border-2 border-ink px-3 py-1 font-mono text-ink uppercase mb-8" style={{ fontSize: 10, letterSpacing: "0.22em" }}>
          Get in Touch
        </div>

        <h2
          className="font-tattoo text-ink uppercase tracking-tighter leading-[0.82]"
          style={{ fontSize: "clamp(3rem, 11vw, 8rem)" }}
        >
          LET&apos;S TALK
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-10 sm:mt-14">
          {/* Contact form card */}
          <div className="border-2 border-ink p-6 sm:p-8">
            <p className="font-mono text-ink uppercase mb-5" style={{ fontSize: 10, letterSpacing: "0.22em" }}>
              Direct Message
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                placeholder="Your name"
                value={formState.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full bg-transparent border-b-2 border-ink/30 py-2.5 font-sans text-base text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none transition-colors"
              />
              <input
                type="email"
                placeholder="your@email.com"
                value={formState.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full bg-transparent border-b-2 border-ink/30 py-2.5 font-sans text-base text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none transition-colors"
              />
              <textarea
                placeholder="What's on your mind?"
                rows={3}
                value={formState.message}
                onChange={(e) => handleChange("message", e.target.value)}
                className="w-full bg-transparent border-b-2 border-ink/30 py-2.5 font-sans text-base text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none transition-colors resize-none"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-ink text-paper font-mono uppercase hover:bg-royal transition-colors duration-300"
                style={{ fontSize: 11, letterSpacing: "0.2em" }}
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Newsletter + IG card */}
          <div className="space-y-4 sm:space-y-6">
            <div className="border-2 border-ink p-6 sm:p-8">
              <p className="font-mono text-ink uppercase mb-2" style={{ fontSize: 10, letterSpacing: "0.22em" }}>
                Vol. II Notify
              </p>
              <p className="font-sans text-ink-soft text-base mb-5">
                Get notified when the next drop opens. No spam, no fluff.
              </p>
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-transparent border-b-2 border-ink/30 py-2.5 font-sans text-base text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-royal text-paper font-mono uppercase hover:bg-royal-deep transition-colors duration-300"
                  style={{ fontSize: 11, letterSpacing: "0.2em" }}
                >
                  Notify Me
                </button>
              </form>
            </div>

            <div className="border-2 border-ink p-6 sm:p-8">
              <p className="font-mono text-ink uppercase mb-3" style={{ fontSize: 10, letterSpacing: "0.22em" }}>
                Elsewhere
              </p>
              <a
                href="https://www.instagram.com/tony.decay"
                target="_blank"
                rel="noopener noreferrer"
                className="block font-sans text-ink hover:text-royal transition-colors text-lg"
              >
                @tony.decay <span className="text-ink-faint">on Instagram -&gt;</span>
              </a>
              <a
                href="mailto:contact@tonydecay.com"
                className="block mt-2 font-sans text-ink hover:text-royal transition-colors text-lg"
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
