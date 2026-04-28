"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { useCheckout } from "@/hooks/useCheckout";

/* MobileMenu — pixel-curtain wipe variant.
   Opens by sweeping a chunky-pixel diagonal wipe from top-left to
   bottom-right via a WebGL fragment shader. Items use the lab N°XX
   pixel-tab numbering vocabulary. Translucent dark plate stays over
   the site behind so context is partially visible.

   ============== TWEAK ME ==============
   Most knobs live as constants here so we can iterate fast. */

const WIPE_DURATION_IN = 1.5; // seconds, open
const WIPE_DURATION_OUT = 0.8; // seconds, close
const WIPE_EASE_IN = "steps(8)"; // chunky stepped wipe — matches gallery reveal
const WIPE_EASE_OUT = "steps(6)"; // close steps slightly fewer
const PIXEL_BLOCK = 0.045; // chunky-edge pixel size in UV (0.02 = finer, 0.08 = chunkier)
const OVERLAY_R = 0.06; // overlay color (RGB 0..1) — deep ink
const OVERLAY_G = 0.06;
const OVERLAY_B = 0.07;
const OVERLAY_ALPHA = 0.985; // 1 = fully opaque, 0.85 = quite translucent
const ITEMS_FADE_AT = 0.72; // wipe progress where items begin to appear (0..1)
const ITEMS_FADE_FULL = 0.97; // wipe progress where items are fully visible
/* =====================================*/

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

type NavItem =
  | { label: string; kind: "anchor"; href: string }
  | { label: string; kind: "checkout" };

const NAV_ITEMS: NavItem[] = [
  { label: "WORK", kind: "anchor", href: "#work" },
  { label: "ABOUT", kind: "anchor", href: "#artist" },
  { label: "SHOP", kind: "checkout" },
  { label: "FAQ", kind: "anchor", href: "#faq" },
  { label: "CONTACT", kind: "anchor", href: "#contact" },
];

/* WebGL: chunky pixel-wipe diagonal fragment shader. */
const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform float uProgress;   // 0..1 — wipe coverage
uniform float uBlock;      // chunky-pixel size in UV
uniform vec3 uColor;       // overlay RGB
uniform float uAlpha;      // overlay alpha
uniform vec2 uOrigin;      // wipe origin in UV (0,0 = top-left)
void main() {
  // Quantize UV so the wipe edge is chunky, not smooth.
  vec2 puv = floor(vUv / uBlock) * uBlock + uBlock * 0.5;

  // y in UV is bottom-up; we want top-left origin (0,1 in UV).
  // Translate so the diagonal sweeps from origin toward opposite corner.
  vec2 d = puv - uOrigin;
  // Manhattan-ish distance, scaled into 0..1
  float dist = (abs(d.x) + abs(d.y));
  // diagonal sweep: covers when dist <= progress * 2.0 (max 2 in unit-square)
  if (dist > uProgress * 2.0) discard;
  gl_FragColor = vec4(uColor, uAlpha);
}
`;

type GL = WebGLRenderingContext;

function compile(gl: GL, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error("shader compile: " + log);
  }
  return s;
}

function buildProgram(gl: GL) {
  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  const p = gl.createProgram()!;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(p);
    gl.deleteProgram(p);
    throw new Error("link: " + log);
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return p;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const cvsRef = useRef<HTMLCanvasElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const { dispatch } = useCheckout();

  /* Persist GL state + tween across opens/closes. */
  const glRef = useRef<{
    gl: GL;
    program: WebGLProgram;
    buf: WebGLBuffer;
    uProgress: WebGLUniformLocation | null;
    uBlock: WebGLUniformLocation | null;
    uColor: WebGLUniformLocation | null;
    uAlpha: WebGLUniformLocation | null;
    uOrigin: WebGLUniformLocation | null;
    progress: { v: number };
    fitCanvas: () => void;
    currentTween: gsap.core.Tween | null;
  } | null>(null);

  /* Mount-once GL setup. */
  useEffect(() => {
    const cvs = cvsRef.current;
    if (!cvs) return;
    const gl = cvs.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: true });
    if (!gl) return;

    const fitCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = cvs.getBoundingClientRect();
      cvs.width = Math.max(1, Math.floor(rect.width * dpr));
      cvs.height = Math.max(1, Math.floor(rect.height * dpr));
      gl.viewport(0, 0, cvs.width, cvs.height);
    };

    const program = buildProgram(gl);
    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const aPos = gl.getAttribLocation(program, "aPos");
    const uProgress = gl.getUniformLocation(program, "uProgress");
    const uBlock = gl.getUniformLocation(program, "uBlock");
    const uColor = gl.getUniformLocation(program, "uColor");
    const uAlpha = gl.getUniformLocation(program, "uAlpha");
    const uOrigin = gl.getUniformLocation(program, "uOrigin");

    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const progress = { v: 0 };

    const draw = () => {
      gl.viewport(0, 0, cvs.width, cvs.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uProgress, progress.v);
      gl.uniform1f(uBlock, PIXEL_BLOCK);
      gl.uniform3f(uColor, OVERLAY_R, OVERLAY_G, OVERLAY_B);
      gl.uniform1f(uAlpha, OVERLAY_ALPHA);
      /* origin = (0, 1) in WebGL UV (top-left of canvas). */
      gl.uniform2f(uOrigin, 0.0, 1.0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const ticker = () => draw();
    gsap.ticker.add(ticker);
    fitCanvas();

    const onResize = () => fitCanvas();
    window.addEventListener("resize", onResize);

    glRef.current = {
      gl,
      program,
      buf,
      uProgress,
      uBlock,
      uColor,
      uAlpha,
      uOrigin,
      progress,
      fitCanvas,
      currentTween: null,
    };

    return () => {
      gsap.ticker.remove(ticker);
      window.removeEventListener("resize", onResize);
      glRef.current?.currentTween?.kill();
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
      glRef.current = null;
    };
  }, []);

  /* Open / close — drive uProgress and item opacity via GSAP. */
  useEffect(() => {
    const panel = panelRef.current;
    const items = itemsRef.current;
    if (!panel || !items) return;

    const state = glRef.current;
    if (!state) return;

    state.currentTween?.kill();

    if (isOpen) {
      getLenis()?.stop();
      document.body.style.overflow = "hidden";
      panel.style.display = "block";
      state.fitCanvas();
      state.progress.v = 0;
      gsap.set(items, { opacity: 0 });

      state.currentTween = gsap.to(state.progress, {
        v: 1,
        duration: WIPE_DURATION_IN,
        ease: WIPE_EASE_IN,
        onUpdate: () => {
          /* Items fade in over the second half of the wipe. */
          const p = state.progress.v;
          const o =
            p < ITEMS_FADE_AT
              ? 0
              : Math.min(1, (p - ITEMS_FADE_AT) / (ITEMS_FADE_FULL - ITEMS_FADE_AT));
          items.style.opacity = String(o);
        },
      });
    } else {
      gsap.to(items, {
        opacity: 0,
        duration: 0.18,
        ease: "power2.out",
      });
      state.currentTween = gsap.to(state.progress, {
        v: 0,
        duration: WIPE_DURATION_OUT,
        ease: WIPE_EASE_OUT,
        onComplete: () => {
          panel.style.display = "none";
          getLenis()?.start();
          document.body.style.overflow = "";
        },
      });
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      getLenis()?.start();
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleAnchorClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    onClose();
    setTimeout(
      () => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      },
      WIPE_DURATION_OUT * 1000 + 50,
    );
  };

  const handleCheckoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    setTimeout(
      () => {
        dispatch({ type: "OPEN" });
      },
      WIPE_DURATION_OUT * 1000 + 50,
    );
  };

  return (
    <div
      ref={panelRef}
      onClick={onClose}
      className="fixed inset-0 z-[110] hidden"
      style={{ display: "none" }}
    >
      <canvas
        ref={cvsRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      />

      <div
        ref={itemsRef}
        className="relative flex h-full w-full flex-col items-center justify-center"
        style={{ opacity: 0 }}
      >
        <div className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
          <nav className="flex w-full max-w-md flex-col items-stretch gap-3 px-8 sm:gap-4">
            {NAV_ITEMS.map((item) => {
              const label = item.label;
              const onEnter = (e: React.MouseEvent<HTMLElement>) => {
                e.currentTarget.style.opacity = "0.6";
              };
              const onLeave = (e: React.MouseEvent<HTMLElement>) => {
                e.currentTarget.style.opacity = "1";
              };
              const rowStyle: React.CSSProperties = {
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "10px 0",
                borderBottom: "1px solid rgba(215,50,46,0.55)",
                cursor: "pointer",
                background: "transparent",
                width: "100%",
                textAlign: "left",
                textDecoration: "none",
                transition: "opacity 200ms ease",
              };
              const Inner = (
                <>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.92)",
                      lineHeight: 1,
                      letterSpacing: "0.02em",
                      flex: 1,
                    }}
                    className="font-tattoo text-[34px] sm:text-5xl md:text-6xl"
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 14,
                      color: "rgba(255,255,255,0.45)",
                      fontWeight: 800,
                    }}
                  >
                    →
                  </span>
                </>
              );
              if (item.kind === "checkout") {
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={handleCheckoutClick}
                    style={{ ...rowStyle, border: "none", borderBottom: rowStyle.borderBottom }}
                    onMouseEnter={onEnter}
                    onMouseLeave={onLeave}
                  >
                    {Inner}
                  </button>
                );
              }
              return (
                <a
                  key={label}
                  href={item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  style={rowStyle}
                  onMouseEnter={onEnter}
                  onMouseLeave={onLeave}
                >
                  {Inner}
                </a>
              );
            })}
          </nav>

          {/* Instagram icon */}
          <a
            href="https://www.instagram.com/tony.decay"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-20 text-white/50 transition-colors duration-300 hover:text-white"
            aria-label="Instagram"
          >
            <svg width="52" height="52" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C9.28 2 8.94 2.01 7.88 2.06C6.81 2.11 6.09 2.28 5.46 2.52C4.8 2.78 4.24 3.12 3.68 3.68C3.12 4.24 2.78 4.8 2.52 5.46C2.28 6.09 2.11 6.81 2.06 7.88C2.01 8.94 2 9.28 2 12C2 14.72 2.01 15.06 2.06 16.12C2.11 17.19 2.28 17.91 2.52 18.54C2.78 19.2 3.12 19.76 3.68 20.32C4.24 20.88 4.8 21.22 5.46 21.48C6.09 21.72 6.81 21.89 7.88 21.94C8.94 21.99 9.28 22 12 22C14.72 22 15.06 21.99 16.12 21.94C17.19 21.89 17.91 21.72 18.54 21.48C19.2 21.22 19.76 20.88 20.32 20.32C20.88 19.76 21.22 19.2 21.48 18.54C21.72 17.91 21.89 17.19 21.94 16.12C21.99 15.06 22 14.72 22 12C22 9.28 21.99 8.94 21.94 7.88C21.89 6.81 21.72 6.09 21.48 5.46C21.22 4.8 20.88 4.24 20.32 3.68C19.76 3.12 19.2 2.78 18.54 2.52C17.91 2.28 17.19 2.11 16.12 2.06C15.06 2.01 14.72 2 12 2ZM12 4.16C14.67 4.16 14.99 4.17 16.04 4.22C17.02 4.26 17.55 4.43 17.9 4.56C18.37 4.74 18.7 4.96 19.05 5.31C19.4 5.66 19.62 5.99 19.8 6.46C19.93 6.81 20.1 7.34 20.14 8.32C20.19 9.38 20.2 9.69 20.2 12.36C20.2 15.03 20.19 15.34 20.14 16.4C20.1 17.38 19.93 17.91 19.8 18.26C19.62 18.73 19.4 19.06 19.05 19.41C18.7 19.76 18.37 19.98 17.9 20.16C17.55 20.29 17.02 20.46 16.04 20.5C14.99 20.55 14.67 20.56 12 20.56C9.33 20.56 9.01 20.55 7.96 20.5C6.98 20.46 6.45 20.29 6.1 20.16C5.63 19.98 5.3 19.76 4.95 19.41C4.6 19.06 4.38 18.73 4.2 18.26C4.07 17.91 3.9 17.38 3.86 16.4C3.81 15.34 3.8 15.03 3.8 12.36C3.8 9.69 3.81 9.38 3.86 8.32C3.9 7.34 4.07 6.81 4.2 6.46C4.38 5.99 4.6 5.66 4.95 5.31C5.3 4.96 5.63 4.74 6.1 4.56C6.45 4.43 6.98 4.26 7.96 4.22C9.01 4.17 9.33 4.16 12 4.16ZM12 6.86C9.16 6.86 6.86 9.16 6.86 12C6.86 14.84 9.16 17.14 12 17.14C14.84 17.14 17.14 14.84 17.14 12C17.14 9.16 14.84 6.86 12 6.86ZM12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15ZM18.84 6.62C18.84 7.34 18.26 7.92 17.54 7.92C16.82 7.92 16.24 7.34 16.24 6.62C16.24 5.9 16.82 5.32 17.54 5.32C18.26 5.32 18.84 5.9 18.84 6.62Z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
