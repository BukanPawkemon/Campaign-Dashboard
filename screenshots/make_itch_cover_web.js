// itch.io cover image for the Dalang Web beta.
// Composites: brand-dark background, the Antaboga dragon mark, the
// "Dalang web" wordmark (the real dalang-web.svg), and a BETA chip.
// Output 630x500 (itch cover spec), PNG + JPG.

const fs = require("fs");
const path = require("path");
const sharp = require("H:/DnD/Project Semar/node_modules/sharp");

const DOCS = "H:/DnD/campaign-dashboard-docs";
const OUT = __dirname; // scratchpad; move into images/ once approved

const W = 630, H = 500;

const markB64 = fs.readFileSync(path.join(DOCS, "images/dalang-mark.png")).toString("base64");
const wordSvg = fs.readFileSync(path.join(DOCS, "web/dalang-web.svg"), "utf8")
  .replace(/<\?xml[^>]*\?>\s*/, "");
const wordB64 = Buffer.from(wordSvg).toString("base64");

// --- layout -------------------------------------------------------------
const cx = W / 2;

// dragon mark, native 232x220
const markW = 198, markH = markW * (220 / 232);
const markX = cx - markW / 2, markY = 32;

// wordmark, native viewBox 348.32 x 188.7
const wordW = 300, wordH = wordW * (188.7 / 348.32);
const wordX = cx - wordW / 2, wordY = markY + markH + 14;

// BETA chip
const chipW = 150, chipH = 34;
const chipX = cx - chipW / 2, chipY = wordY + wordH + 12;

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="42%" r="78%">
      <stop offset="0%" stop-color="#2b221b"/>
      <stop offset="60%" stop-color="#1d1712"/>
      <stop offset="100%" stop-color="#161210"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#e3a857" stop-opacity="0.20"/>
      <stop offset="70%" stop-color="#e3a857" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#e3a857" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- faint d20 silhouettes, texture only -->
  <g stroke="#3a2c1c" stroke-width="1.5" fill="none" opacity="0.35">
    <polygon points="70,392 104,412 104,452 70,472 36,452 36,412"/>
    <polygon points="566,60 590,74 590,102 566,116 542,102 542,74"/>
  </g>

  <!-- hairline frame -->
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" fill="none" stroke="#33291f" stroke-width="2"/>

  <!-- dragon -->
  <ellipse cx="${cx}" cy="${markY + markH / 2}" rx="150" ry="140" fill="url(#glow)"/>
  <image x="${markX}" y="${markY}" width="${markW}" height="${markH}"
         href="data:image/png;base64,${markB64}"/>

  <!-- wordmark -->
  <image x="${wordX}" y="${wordY}" width="${wordW}" height="${wordH}"
         href="data:image/svg+xml;base64,${wordB64}"/>

  <!-- BETA chip -->
  <rect x="${chipX}" y="${chipY}" width="${chipW}" height="${chipH}" rx="5"
        fill="#c9a227" fill-opacity="0.12" stroke="#a8842c" stroke-width="1.5"/>
  <text x="${cx + 3}" y="${chipY + chipH / 2 + 6}" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif" font-size="17"
        font-weight="bold" letter-spacing="7" fill="#e3b866">BETA</text>
</svg>
`;

fs.writeFileSync(path.join(OUT, "itch-cover-web.svg"), svg);

const src = sharp(Buffer.from(svg), { density: 320 }).resize(W, H);
Promise.all([
  src.clone().png().toFile(path.join(OUT, "itch-cover-web-630x500.png")),
  src.clone().jpeg({ quality: 90, chromaSubsampling: "4:4:4" }).toFile(path.join(OUT, "itch-cover-web-630x500.jpg")),
])
  .then(() => console.log("wrote itch-cover-web-630x500 .png/.jpg to", OUT))
  .catch((e) => { console.error(e); process.exit(1); });
