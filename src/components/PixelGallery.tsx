"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";

const INK = "#1a1a1a";
const PAPER = "#f0ebdc";
const GOLD = "#F7C234";
const CRIMSON = "#d7322e";

const PRINTS = PLACEHOLDER_PRINTS;

/* PIXEL GALLERY — homepage section. 3-col mobile / 5-col desktop grid.
   Each thumb is a pixelated Canvas2D render of the print at its
   natural aspect. Click → fullscreen WebGL reveal with chunky stepped
   un-pixelation. Inside fullscreen: ← / → arrows (or keyboard) advance
   to prev/next print, replaying the stepped intro on each one — no
   close-and-reopen flicker. Click outside / Esc / click the print
   itself fades the overlay out. */

const GRID_BLOCK_PX = 22;
const REVEAL_STEPS = 5;
const REVEAL_FROM = 0.06;
const REVEAL_TO = 0.0006;

/* ============== Pixelated thumbnail (Canvas2D) ============== */
function PixelThumb({
  src,
  alt,
  viewed,
  onClick,
  index,
}: {
  src: string;
  alt: string;
  viewed: boolean;
  onClick: () => void;
  index: number;
}) {
  const cvsRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [aspect, setAspect] = useState<number | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      imgRef.current = img;
      setAspect(img.naturalWidth / img.naturalHeight);
      paint();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const paint = () => {
    const cvs = cvsRef.current;
    const img = imgRef.current;
    if (!cvs || !img) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = cvs.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width * dpr));
    const h = Math.max(1, Math.floor(rect.height * dpr));
    cvs.width = w;
    cvs.height = h;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    if (viewed) {
      ctx.imageSmoothingEnabled = true;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      return;
    }
    const ia = img.naturalWidth / img.naturalHeight;
    const blockW = ia >= 1 ? GRID_BLOCK_PX : Math.max(1, Math.round(GRID_BLOCK_PX * ia));
    const blockH = ia >= 1 ? Math.max(1, Math.round(GRID_BLOCK_PX / ia)) : GRID_BLOCK_PX;
    const off = document.createElement("canvas");
    off.width = blockW;
    off.height = blockH;
    const octx = off.getContext("2d");
    if (!octx) return;
    octx.imageSmoothingEnabled = true;
    octx.drawImage(img, 0, 0, blockW, blockH);
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(off, 0, 0, blockW, blockH, 0, 0, w, h);
  };

  useEffect(() => {
    paint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewed]);

  useEffect(() => {
    const ro = new ResizeObserver(() => paint());
    if (cvsRef.current) ro.observe(cvsRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open ${alt} fullscreen`}
      style={{
        position: "relative",
        aspectRatio: aspect ? `${aspect}` : "4 / 5",
        background: "#ECE4D0",
        border: `2px solid ${INK}`,
        boxShadow: "4px 4px 0 #1a1a1a",
        padding: 0,
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      <canvas ref={cvsRef} style={{ width: "100%", height: "100%", display: "block" }} />
      <span
        style={{
          position: "absolute",
          top: 6,
          left: 6,
          background: GOLD,
          color: INK,
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9,
          letterSpacing: "0.28em",
          fontWeight: 800,
          padding: "2px 6px",
          border: `1px solid ${INK}`,
        }}
      >
        N°{String(index + 1).padStart(2, "0")}
      </span>
      {viewed && (
        <span
          style={{
            position: "absolute",
            bottom: 6,
            right: 6,
            background: CRIMSON,
            color: PAPER,
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.28em",
            fontWeight: 800,
            padding: "2px 6px",
            border: `1px solid ${INK}`,
          }}
        >
          VIEWED
        </span>
      )}
    </button>
  );
}

/* ============== Fullscreen WebGL reveal ============== */

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
uniform sampler2D uTex;
uniform float uBlockX;
uniform float uBlockY;
void main() {
  vec2 uv = vUv;
  if (uBlockX > 0.0005) {
    uv.x = floor(uv.x / uBlockX) * uBlockX + uBlockX * 0.5;
  }
  if (uBlockY > 0.0005) {
    uv.y = floor(uv.y / uBlockY) * uBlockY + uBlockY * 0.5;
  }
  uv.y = 1.0 - uv.y;
  vec4 c = texture2D(uTex, uv);
  gl_FragColor = c;
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

type RevealProps = {
  src: string;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onDismiss: () => void;
};

function FullscreenReveal({ src, index, total, onPrev, onNext, onDismiss }: RevealProps) {
  const cvsRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dismissingRef = useRef(false);
  const [aspect, setAspect] = useState<number | null>(null);

  /* Persist GL state across src changes so navigation doesn't tear
     down and rebuild the WebGL context. */
  const glRef = useRef<{
    gl: GL;
    tex: WebGLTexture;
    program: WebGLProgram;
    buf: WebGLBuffer;
    block: { x: number; y: number };
    uBlockX: WebGLUniformLocation | null;
    uBlockY: WebGLUniformLocation | null;
    fitCanvas: () => void;
    currentTween: gsap.core.Tween | null;
  } | null>(null);

  /* One-time GL setup. */
  useEffect(() => {
    const cvs = cvsRef.current;
    if (!cvs) return;
    const gl = cvs.getContext("webgl", { antialias: true, alpha: true });
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

    const aPos = gl.getAttribLocation(program, "aPos");
    const uTex = gl.getUniformLocation(program, "uTex");
    const uBlockX = gl.getUniformLocation(program, "uBlockX");
    const uBlockY = gl.getUniformLocation(program, "uBlockY");

    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([255, 255, 255, 255]),
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(uTex, 0);

    const block = { x: REVEAL_FROM, y: REVEAL_FROM };
    fitCanvas();

    const draw = () => {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uBlockX, block.x);
      gl.uniform1f(uBlockY, block.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const ticker = () => draw();
    gsap.ticker.add(ticker);

    const onResize = () => fitCanvas();
    window.addEventListener("resize", onResize);

    glRef.current = {
      gl,
      tex,
      program,
      buf,
      block,
      uBlockX,
      uBlockY,
      fitCanvas,
      currentTween: null,
    };

    return () => {
      gsap.ticker.remove(ticker);
      window.removeEventListener("resize", onResize);
      glRef.current?.currentTween?.kill();
      gl.deleteBuffer(buf);
      gl.deleteTexture(tex);
      gl.deleteProgram(program);
      glRef.current = null;
    };
  }, []);

  /* Texture swap + reset stepped reveal whenever src changes. */
  useEffect(() => {
    const state = glRef.current;
    if (!state) {
      /* GL not ready yet — re-run when it is. The mount effect above
         races, so we set a tiny rAF retry. */
      const id = requestAnimationFrame(() => {
        loadAndAnimate();
      });
      return () => cancelAnimationFrame(id);
    }
    loadAndAnimate();

    function loadAndAnimate() {
      const s = glRef.current;
      if (!s) return;
      s.currentTween?.kill();
      s.block.x = REVEAL_FROM;
      s.block.y = REVEAL_FROM;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        const cur = glRef.current;
        if (!cur) return;
        cur.fitCanvas();
        cur.gl.bindTexture(cur.gl.TEXTURE_2D, cur.tex);
        cur.gl.texImage2D(
          cur.gl.TEXTURE_2D,
          0,
          cur.gl.RGBA,
          cur.gl.RGBA,
          cur.gl.UNSIGNED_BYTE,
          img,
        );
        const ia = img.naturalWidth / img.naturalHeight;
        setAspect(ia);
        /* Container is now aspect-matched, so square mosaic blocks just
           need uBlockX === uBlockY — no aspect compensation. */
        cur.block.x = REVEAL_FROM;
        cur.block.y = REVEAL_FROM;
        cur.currentTween = gsap.to(cur.block, {
          x: REVEAL_TO,
          y: REVEAL_TO,
          duration: 0.85,
          ease: `steps(${REVEAL_STEPS})`,
        });
      };
    }
  }, [src]);

  /* Dismiss = opacity fade, no reverse pixelation. */
  const dismiss = () => {
    if (dismissingRef.current) return;
    dismissingRef.current = true;
    const overlay = overlayRef.current;
    if (overlay) {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.32,
        ease: "power2.out",
        onComplete: () => onDismiss(),
      });
    } else {
      onDismiss();
    }
  };

  /* Keyboard: ← / → navigate, Esc dismiss. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onPrev, onNext]);

  const stop = (e: React.MouseEvent | React.TouchEvent) => e.stopPropagation();

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-label={`Print ${index + 1} fullscreen`}
      onClick={dismiss}
      onTouchEnd={dismiss}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(10,10,10,0.96)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        cursor: "pointer",
      }}
    >
      {/* Left arrow */}
      <button
        type="button"
        aria-label="Previous print"
        onClick={(e) => {
          stop(e);
          onPrev();
        }}
        onTouchEnd={(e) => {
          stop(e);
          onPrev();
        }}
        style={{
          position: "absolute",
          left: "max(16px, 3vw)",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 110,
          background: GOLD,
          color: INK,
          border: `2px solid ${INK}`,
          boxShadow: "3px 3px 0 #1a1a1a",
          padding: "10px 14px",
          fontFamily: "var(--font-arcade), sans-serif",
          fontSize: 22,
          lineHeight: 1,
          cursor: "pointer",
        }}
      >
        ◄
      </button>

      {/* Right arrow */}
      <button
        type="button"
        aria-label="Next print"
        onClick={(e) => {
          stop(e);
          onNext();
        }}
        onTouchEnd={(e) => {
          stop(e);
          onNext();
        }}
        style={{
          position: "absolute",
          right: "max(16px, 3vw)",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 110,
          background: GOLD,
          color: INK,
          border: `2px solid ${INK}`,
          boxShadow: "3px 3px 0 #1a1a1a",
          padding: "10px 14px",
          fontFamily: "var(--font-arcade), sans-serif",
          fontSize: 22,
          lineHeight: 1,
          cursor: "pointer",
        }}
      >
        ►
      </button>

      <div
        style={{
          position: "relative",
          /* Largest box that fits 94vw AND 94vh given the print's natural
             aspect — guarantees container aspect == image aspect, so the
             canvas never stretches the image. */
          width: "100%",
          maxWidth: aspect ? `min(94vw, ${(94 * aspect).toFixed(3)}vh)` : "min(94vw, 75vh)",
          aspectRatio: aspect ? `${aspect}` : "4 / 5",
          background: "#000",
          border: `2px solid ${INK}`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
        }}
      >
        <canvas
          ref={cvsRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            cursor: "pointer",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: GOLD,
            color: INK,
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.32em",
            fontWeight: 800,
            padding: "4px 10px",
            border: `1px solid ${INK}`,
            pointerEvents: "none",
          }}
        >
          N°{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            background: "rgba(10,10,10,0.85)",
            color: PAPER,
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.32em",
            fontWeight: 800,
            padding: "4px 10px",
            border: `1px solid ${PAPER}`,
            pointerEvents: "none",
          }}
        >
          ← → · TAP TO DISMISS
        </div>
      </div>
    </div>
  );
}

/* ============== Section component ============== */
export function PixelGallery() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [viewed, setViewed] = useState<Set<number>>(() => new Set());

  const open = (i: number) => {
    setActiveIdx(i);
    setViewed((prev) => {
      const n = new Set(prev);
      n.add(i);
      return n;
    });
  };

  const close = () => setActiveIdx(null);

  const navigate = (delta: 1 | -1) => {
    setActiveIdx((cur) => {
      if (cur === null) return cur;
      const next = (cur + delta + PRINTS.length) % PRINTS.length;
      setViewed((prev) => {
        const n = new Set(prev);
        n.add(next);
        return n;
      });
      return next;
    });
  };

  return (
    <section
      id="gallery"
      className="relative w-full"
      style={{
        background: "var(--color-bg)",
        borderTop: "3px solid var(--color-ink)",
        borderBottom: "3px solid var(--color-ink)",
      }}
    >
      <div className="relative mx-auto max-w-6xl px-7 py-14 sm:px-10 sm:py-20 2xl:max-w-[1400px]">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span
              className="text-[14px] sm:text-[18px]"
              style={{
                fontFamily: "var(--font-mono), monospace",
                letterSpacing: "0.32em",
                fontWeight: 800,
                color: GOLD,
              }}
            >
              GALLERY · 印刷 · {PRINTS.length} PRINTS
            </span>
            <h2
              className="mt-2"
              style={{
                fontFamily: "var(--font-tattoo), sans-serif",
                fontSize: "clamp(2.6rem, 8vw, 5.5rem)",
                color: PAPER,
                lineHeight: 0.95,
                letterSpacing: "0.005em",
              }}
            >
              TAP TO REVEAL
            </h2>
            <p
              className="mt-3 max-w-md"
              style={{
                fontFamily: "var(--font-display), serif",
                fontStyle: "italic",
                fontSize: 16,
                lineHeight: 1.55,
                color: "rgba(240,235,220,0.78)",
              }}
            >
              All fifteen prints from Vol. 01. Tap any one — the mosaic resolves in chunky steps.
              Use ← → to flip through, click outside to dismiss.
            </p>
          </div>
          <div
            className="hidden sm:block"
            style={{
              fontFamily: "var(--font-arcade), sans-serif",
              fontSize: 24,
              color: GOLD,
              letterSpacing: "0.04em",
              textShadow: `2px 2px 0 ${INK}`,
            }}
          >
            {viewed.size}/{PRINTS.length}
          </div>
        </div>

        <div className="grid grid-cols-3 items-start gap-3 sm:grid-cols-5 sm:gap-5">
          {PRINTS.map((p, i) => (
            <PixelThumb
              key={i}
              index={i}
              src={p.src}
              alt={p.alt}
              viewed={viewed.has(i)}
              onClick={() => open(i)}
            />
          ))}
        </div>
      </div>

      {activeIdx !== null && (
        <FullscreenReveal
          src={PRINTS[activeIdx].src}
          index={activeIdx}
          total={PRINTS.length}
          onPrev={() => navigate(-1)}
          onNext={() => navigate(1)}
          onDismiss={close}
        />
      )}
    </section>
  );
}
