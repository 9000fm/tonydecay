import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";

// Designed share card for tonydecay.com (shown when the link is posted on
// IG / WhatsApp / etc.). Next auto-wires this as the route's og:image.
export const alt = "Tony Decay — Coming Soon";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const anton = await readFile(new URL("./Anton-Regular.ttf", import.meta.url));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0b0e12",
        fontFamily: "Anton",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 38,
          left: 38,
          right: 38,
          bottom: 38,
          border: "1px solid rgba(150,170,190,0.18)",
        }}
      />
      <div style={{ display: "flex", fontSize: 30, letterSpacing: 16, color: "#7f93a6" }}>
        COMING SOON
      </div>
      <div style={{ display: "flex", alignItems: "center", marginTop: 26 }}>
        <span style={{ fontSize: 172, color: "#e8edf2" }}>TONY</span>
        <span style={{ fontSize: 108, color: "#7f93a6", marginLeft: 26, marginRight: 26 }}>×</span>
        <span style={{ fontSize: 172, color: "#e8edf2" }}>DECAY</span>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 28,
          letterSpacing: 11,
          color: "#7f93a6",
          marginTop: 40,
        }}
      >
        FIFTY SIGNED SETS · SHIPPED WORLDWIDE
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Anton", data: anton, style: "normal", weight: 400 }],
    },
  );
}
