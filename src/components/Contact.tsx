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
    console.log("Contact form submitted:", formState);
    // TODO: hook up to backend (Resend)
  };

  const handleNewsletter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Newsletter signup:", newsletterEmail);
    // TODO: hook up to backend
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section
      id="contact"
      className="bg-paper border-ink relative overflow-hidden border-b-2 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section label */}
        <div
          className="border-ink text-ink mb-8 inline-block border-2 px-3 py-1 font-mono uppercase"
          style={{ fontSize: 10, letterSpacing: "0.22em" }}
        >
          Get in Touch
        </div>

        <h2
          className="font-tattoo text-ink leading-[0.82] tracking-tighter uppercase"
          style={{ fontSize: "clamp(3rem, 11vw, 8rem)" }}
        >
          LET&apos;S TALK
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:gap-6 md:grid-cols-2">
          {/* Contact form card */}
          <div className="border-ink border-2 p-6 sm:p-8">
            <p
              className="text-ink mb-5 font-mono uppercase"
              style={{ fontSize: 10, letterSpacing: "0.22em" }}
            >
              Direct Message
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                placeholder="Your name"
                value={formState.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="border-ink/30 text-ink placeholder:text-ink-faint focus:border-ink w-full border-b-2 bg-transparent py-2.5 font-sans text-base transition-colors focus:outline-none"
              />
              <input
                type="email"
                placeholder="your@email.com"
                value={formState.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="border-ink/30 text-ink placeholder:text-ink-faint focus:border-ink w-full border-b-2 bg-transparent py-2.5 font-sans text-base transition-colors focus:outline-none"
              />
              <textarea
                placeholder="What's on your mind?"
                rows={3}
                value={formState.message}
                onChange={(e) => handleChange("message", e.target.value)}
                className="border-ink/30 text-ink placeholder:text-ink-faint focus:border-ink w-full resize-none border-b-2 bg-transparent py-2.5 font-sans text-base transition-colors focus:outline-none"
              />
              <button
                type="submit"
                className="bg-ink text-paper hover:bg-royal inline-flex h-11 items-center justify-center rounded-full px-6 font-mono uppercase transition-colors duration-300"
                style={{ fontSize: 11, letterSpacing: "0.2em" }}
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Newsletter + IG card */}
          <div className="space-y-4 sm:space-y-6">
            <div className="border-ink border-2 p-6 sm:p-8">
              <p
                className="text-ink mb-2 font-mono uppercase"
                style={{ fontSize: 10, letterSpacing: "0.22em" }}
              >
                Vol. II Notify
              </p>
              <p className="text-ink-soft mb-5 font-sans text-base">
                Get notified when the next drop opens. No spam, no fluff.
              </p>
              <form onSubmit={handleNewsletter} className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="border-ink/30 text-ink placeholder:text-ink-faint focus:border-ink flex-1 border-b-2 bg-transparent py-2.5 font-sans text-base transition-colors focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-royal text-paper hover:bg-royal-deep inline-flex h-11 items-center justify-center rounded-full px-6 font-mono uppercase transition-colors duration-300"
                  style={{ fontSize: 11, letterSpacing: "0.2em" }}
                >
                  Notify Me
                </button>
              </form>
            </div>

            <div className="border-ink border-2 p-6 sm:p-8">
              <p
                className="text-ink mb-3 font-mono uppercase"
                style={{ fontSize: 10, letterSpacing: "0.22em" }}
              >
                Elsewhere
              </p>
              <a
                href="https://www.instagram.com/tony.decay"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-royal block font-sans text-lg transition-colors"
              >
                @tony.decay <span className="text-ink-faint">on Instagram -&gt;</span>
              </a>
              <a
                href="mailto:contact@tonydecay.com"
                className="text-ink hover:text-royal mt-2 block font-sans text-lg transition-colors"
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
