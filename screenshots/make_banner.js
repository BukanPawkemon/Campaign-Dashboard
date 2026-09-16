const fs = require("fs");
const path = require("path");
const sharp = require("H:/DnD/Project Semar/node_modules/sharp");

const scratch = "C:/Users/Kusu/AppData/Local/Temp/claude/h--DnD-Project-Semar/804111b3-40f0-400a-80fb-b06de2574761/scratchpad";
const iconB64 = fs.readFileSync(path.join(scratch, "icon_b64.txt"), "utf8");

const W = 900, H = 225;

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="30%" cy="45%" r="85%">
      <stop offset="0%" stop-color="#1f180f"/>
      <stop offset="55%" stop-color="#14100b"/>
      <stop offset="100%" stop-color="#0a0806"/>
    </radialGradient>
    <linearGradient id="goldText" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f2c685"/>
      <stop offset="100%" stop-color="#d89b4a"/>
    </linearGradient>
    <radialGradient id="iconGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#e3a857" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#e3a857" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- thin gold frame -->
  <rect x="3" y="3" width="${W - 6}" height="${H - 6}" fill="none" stroke="#3a2a15" stroke-width="2"/>

  <!-- faint hex/d20 pattern accents -->
  <g stroke="#3a2a15" stroke-width="1" fill="none" opacity="0.5">
    <polygon points="820,20 845,35 845,65 820,80 795,65 795,35"/>
    <polygon points="60,150 85,165 85,195 60,210 35,195 35,165"/>
  </g>

  <circle cx="115" cy="112" r="98" fill="url(#iconGlow)"/>
  <image x="27" y="27" width="176" height="176" href="data:image/png;base64,${iconB64}"/>

  <line x1="232" y1="45" x2="232" y2="180" stroke="#3a2a15" stroke-width="2"/>

  <text x="264" y="103" font-family="Georgia, 'Times New Roman', serif" font-size="52" font-weight="bold" fill="url(#goldText)" letter-spacing="2">DALANG</text>
  <text x="266" y="136" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#f5e9d3" letter-spacing="1">Campaign Dashboard</text>
  <text x="266" y="168" font-family="Arial, Helvetica, sans-serif" font-size="17" fill="#a8967a" letter-spacing="0.5">Traktir kopi biar campaign-nya jalan terus</text>
</svg>
`;

fs.writeFileSync(path.join(scratch, "trakteer_banner.svg"), svg);

sharp(Buffer.from(svg), { density: 300 })
  .resize(W, H)
  .png()
  .toFile(path.join(scratch, "trakteer_banner.png"))
  .then(() => console.log("done"))
  .catch((e) => { console.error(e); process.exit(1); });
