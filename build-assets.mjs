// Generates the animated SVG assets for the profile README.
// Run:  node build-assets.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = dirname(fileURLToPath(import.meta.url))
const out = join(root, "assets")
mkdirSync(out, { recursive: true })
const mascot = "data:image/jpeg;base64," + readFileSync(join(out, "mascot.jpg")).toString("base64")

const FONT = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
const MONO = "'Courier New', Consolas, monospace"
const P = { bg1: "#07020f", bg2: "#1b0838", purple: "#a855f7", violet: "#7c3aed", pink: "#f472b6", magenta: "#d946ef", text: "#ede9fe", soft: "#c4b5fd" }

/* ---------- shared pieces ---------- */
const defs = (id = "") => `
<defs>
  <linearGradient id="bg${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${P.bg1}"/><stop offset="1" stop-color="${P.bg2}"/>
  </linearGradient>
  <linearGradient id="bar${id}" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${P.violet}" stop-opacity="0"/>
    <stop offset=".5" stop-color="${P.purple}" stop-opacity=".9"/>
    <stop offset="1" stop-color="${P.magenta}" stop-opacity=".1"/>
  </linearGradient>
  <radialGradient id="glow${id}"><stop offset="0" stop-color="${P.purple}" stop-opacity=".55"/><stop offset="1" stop-color="${P.purple}" stop-opacity="0"/></radialGradient>
  <filter id="blur${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
  <pattern id="grid${id}" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M40 0H0V40" fill="none" stroke="${P.purple}" stroke-opacity=".10"/>
  </pattern>
</defs>`

const baseCss = `
  text{font-family:${FONT}}
  @keyframes gridMove{to{transform:translate(40px,40px)}}
  @keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes spinR{to{transform:rotate(-360deg)}}
  @keyframes pulse{0%,100%{opacity:.55}50%{opacity:1}}
  @keyframes slideA{0%,100%{transform:translate(0,0)}50%{transform:translate(14px,-14px)}}
  @keyframes slideB{0%,100%{transform:translate(0,0)}50%{transform:translate(-14px,14px)}}
  @keyframes cycle{0%{opacity:0;transform:translateY(8px)}6%{opacity:1;transform:translateY(0)}30%{opacity:1}36%{opacity:0}100%{opacity:0}}
  @keyframes blink{50%{opacity:0}}
  @keyframes rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
  @keyframes scan{0%{transform:translateY(-20px)}100%{transform:translateY(var(--h))}}
  .grid{animation:gridMove 6s linear infinite}
  .float{animation:floaty 5s ease-in-out infinite}
  .spin{animation:spin 24s linear infinite;transform-box:fill-box;transform-origin:center}
  .spinR{animation:spinR 36s linear infinite;transform-box:fill-box;transform-origin:center}
  .pulse{animation:pulse 3s ease-in-out infinite}
  .rise{opacity:0;animation:rise .7s ease-out forwards}
  .glowtxt{filter:drop-shadow(0 0 6px ${P.purple})}
  @media (prefers-reduced-motion: reduce){*{animation:none!important;opacity:1!important}}
`

const backdrop = (w, h, id = "") => `
  <rect width="${w}" height="${h}" fill="url(#bg${id})"/>
  <g class="grid"><rect x="-40" y="-40" width="${w + 80}" height="${h + 80}" fill="url(#grid${id})"/></g>
  <g class="pulse"><ellipse cx="${w * 0.78}" cy="${h * 0.5}" rx="${w * 0.28}" ry="${h * 0.6}" fill="url(#glow${id})"/></g>
`

const svg = (w, h, body, extraCss = "", id = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img">
<style>${baseCss}${extraCss}</style>${defs(id)}
<clipPath id="round${id}"><rect width="${w}" height="${h}" rx="22"/></clipPath>
<g clip-path="url(#round${id})">${body}</g>
<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="22" fill="none" stroke="${P.purple}" stroke-opacity=".45"/>
</svg>`

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;")

/* ---------- 1. HERO ---------- */
{
  const w = 900, h = 440
  const lines = ["Software Engineering Student", "Cyberpunk Builder", "Arch User BTW"]
  const body = `
  ${backdrop(w, h, "h")}
  <!-- angled neon bars, like the mascot artwork -->
  <g style="animation:slideA 7s ease-in-out infinite"><polygon points="0,150 150,0 230,0 0,230" fill="url(#barh)"/></g>
  <g style="animation:slideA 9s ease-in-out infinite"><polygon points="0,260 120,140 150,140 0,290" fill="${P.purple}" opacity=".35"/></g>
  <g style="animation:slideB 8s ease-in-out infinite"><polygon points="900,290 760,440 900,440" fill="url(#barh)"/></g>
  <g style="animation:slideB 10s ease-in-out infinite"><polygon points="900,200 820,290 900,290" fill="${P.purple}" opacity=".3"/></g>

  <!-- mascot with neon ring -->
  <g transform="translate(675 220)">
    <circle r="178" fill="none" stroke="${P.purple}" stroke-width="6" opacity=".9" filter="url(#blurh)" class="pulse"/>
    <circle r="178" fill="none" stroke="${P.purple}" stroke-width="3"/>
    <g class="spin"><circle r="196" fill="none" stroke="${P.pink}" stroke-width="2" stroke-dasharray="3 14" stroke-linecap="round"/></g>
    <g class="spinR"><circle r="210" fill="none" stroke="${P.soft}" stroke-opacity=".5" stroke-width="1.5" stroke-dasharray="60 40 8 40"/></g>
    <g class="float">
      <clipPath id="mc"><circle r="172"/></clipPath>
      <image href="${mascot}" x="-172" y="-172" width="344" height="344" clip-path="url(#mc)"/>
    </g>
  </g>

  <!-- speech bubble -->
  <g class="rise" style="animation-delay:.2s">
    <path d="M60 70 h330 a28 28 0 0 1 28 28 v110 a28 28 0 0 1 -28 28 h-120 l-34 40 l-8 -40 h-168 a28 28 0 0 1 -28 -28 v-110 a28 28 0 0 1 28 -28z"
          fill="${P.bg1}" fill-opacity=".85" stroke="${P.magenta}" stroke-width="3" filter="drop-shadow(0 0 8px ${P.magenta})"/>
    <text x="90" y="128" font-size="34" font-weight="800" fill="${P.text}">Yo! I am</text>
    <text x="90" y="172" font-size="34" font-weight="800" fill="${P.pink}" class="glowtxt">Nithija Kalpa</text>
    <text x="90" y="212" font-size="19" fill="${P.soft}">Just tech!</text>
  </g>

  <!-- rotating titles -->
  <g transform="translate(60 340)">
    <text x="0" y="-22" font-size="12" letter-spacing="4" fill="${P.purple}" font-family="${MONO}">&gt; WHOAMI</text>
    ${lines
      .map(
        (t, i) => `<text x="0" y="14" font-size="26" font-weight="700" fill="${P.text}" opacity="0" style="animation:cycle 9s ${i * 3}s infinite">${esc(t)}</text>`
      )
      .join("\n    ")}
    <rect x="0" y="30" width="62" height="4" rx="2" fill="${P.magenta}"/>
    <rect x="68" y="30" width="14" height="4" rx="2" fill="${P.purple}" style="animation:blink 1s steps(2) infinite"/>
  </g>`
  writeFileSync(join(out, "hero.svg"), svg(w, h, body, "", "h"))
}

/* ---------- 2. PILL BUTTONS ---------- */
const pills = [
  ["portfolio", "Portfolio", P.magenta],
  ["linkedin", "LinkedIn", "#60a5fa"],
  ["github", "GitHub", P.soft],
  ["instagram", "Instagram", P.pink],
]
for (const [file, label, color] of pills) {
  const w = 200, h = 60
  const body = `
  <rect x="3" y="3" width="${w - 6}" height="${h - 6}" rx="16" fill="${P.bg1}" fill-opacity=".9"/>
  <rect x="3" y="3" width="${w - 6}" height="${h - 6}" rx="16" fill="none" stroke="${color}" stroke-width="2.5" class="pulse" filter="drop-shadow(0 0 5px ${color})"/>
  <circle cx="30" cy="30" r="5" fill="${color}" class="pulse"/>
  <text x="48" y="36" font-size="18" font-weight="700" fill="${P.text}">${label}</text>`
  const pill = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img"><title>${label}</title><style>${baseCss}</style>${body}</svg>`
  writeFileSync(join(out, `pill-${file}.svg`), pill)
}

/* ---------- 3. TECH PANEL (2x2 around the mascot) ---------- */
const STACK = {
  Frontend: ["HTML", "CSS", "JavaScript", "Tailwind CSS", "Bootstrap", "TypeScript"],
  Backend: ["Java", "Docker", "Firebase", "Flutter", "Spring", "Gradle", "C", "C#", "PHP", "C++"],
  "Tools & IDE": ["VS Code", "IntelliJ IDEA", "Eclipse", "Git", "GitHub", "Figma", "Discord", "Notion", "Android Studio", "Postman"],
  "Operating Systems": ["Windows", "macOS", "Arch", "Debian", "Linux Mint", "Ubuntu"],
}
const COLORS = [P.purple, P.pink, "#60a5fa", P.magenta]

function chips(items, x0, y0, maxW, color, delay0) {
  let x = x0, y = y0, s = ""
  items.forEach((t, i) => {
    const cw = Math.round(t.length * 7.8 + 26)
    if (x + cw > x0 + maxW) { x = x0; y += 36 }
    s += `<g class="rise" style="animation-delay:${(delay0 + i * 0.06).toFixed(2)}s">
      <rect x="${x}" y="${y}" width="${cw}" height="28" rx="14" fill="${color}" fill-opacity=".12" stroke="${color}" stroke-opacity=".8"/>
      <text x="${x + cw / 2}" y="${y + 19}" font-size="13" font-weight="600" text-anchor="middle" fill="${P.text}">${esc(t)}</text></g>`
    x += cw + 8
  })
  return s
}

{
  const w = 900, h = 660, cx = 450, cy = 330
  const names = Object.keys(STACK)
  const tags = ["Build", "Ship", "Craft", "Run"]
  const quad = [
    { x: 40, ty: 66, cy0: 96, tx: 290 },
    { x: 490, ty: 66, cy0: 96, tx: 310 },
    { x: 40, ty: 470, cy0: 500, tx: 210 },
    { x: 490, ty: 470, cy0: 500, tx: 310 },
  ]
  const body = `
  ${backdrop(w, h, "p")}
  <line x1="${w / 2}" y1="0" x2="${w / 2}" y2="${h}" stroke="${P.purple}" stroke-opacity=".35"/>
  <line x1="0" y1="${h / 2}" x2="${w}" y2="${h / 2}" stroke="${P.purple}" stroke-opacity=".35"/>
  ${names
    .map((n, i) => {
      const q = quad[i], c = COLORS[i]
      return `
  <text x="${q.x}" y="${q.ty}" font-size="30" font-weight="800" fill="${P.text}" class="rise" style="animation-delay:${i * 0.15}s">${esc(n)}</text>
  <rect x="${q.x + q.tx}" y="${q.ty - 26}" width="80" height="32" rx="9" fill="none" stroke="${c}" stroke-width="2" class="pulse"/>
  <text x="${q.x + q.tx + 40}" y="${q.ty - 5}" font-size="14" font-weight="700" text-anchor="middle" fill="${c}">${tags[i]}</text>
  ${chips(STACK[n], q.x, q.cy0, 370, c, 0.3 + i * 0.15)}`
    })
    .join("")}
  <!-- centre medallion -->
  <g transform="translate(${cx} ${cy})">
    <circle r="112" fill="${P.bg1}"/>
    <circle r="112" fill="none" stroke="${P.magenta}" stroke-width="4" filter="drop-shadow(0 0 10px ${P.magenta})" class="pulse"/>
    <g class="spin"><circle r="128" fill="none" stroke="${P.pink}" stroke-width="2" stroke-dasharray="4 12" stroke-linecap="round"/></g>
    <g class="spinR"><circle r="142" fill="none" stroke="${P.soft}" stroke-opacity=".5" stroke-dasharray="70 30 10 30"/></g>
    <g class="float">
      <clipPath id="pc"><circle r="104"/></clipPath>
      <image href="${mascot}" x="-104" y="-104" width="208" height="208" clip-path="url(#pc)"/>
    </g>
  </g>`
  writeFileSync(join(out, "tech-panel.svg"), svg(w, h, body, "", "p"))
}

/* ---------- 4. CHARTS (donut + bars, from the stack data above) ---------- */
{
  const w = 900, h = 380
  const counts = names2()
  function names2() { return Object.entries(STACK).map(([k, v]) => [k, v.length]) }
  const total = counts.reduce((a, [, n]) => a + n, 0)
  const R = 92, C = 2 * Math.PI * R
  let off = 0
  const segs = counts
    .map(([name, n], i) => {
      const len = (n / total) * C
      const seg = `<circle r="${R}" fill="none" stroke="${COLORS[i]}" stroke-width="30" stroke-dashoffset="${(-off).toFixed(2)}"
        style="--l:${(len - 4).toFixed(2)};stroke-dasharray:0 ${C.toFixed(2)};animation:draw 1.2s ${0.2 + i * 0.25}s ease-out forwards" transform="rotate(-90)"/>`
      off += len
      return seg
    })
    .join("")
  const max = Math.max(...counts.map(([, n]) => n))
  const bars = counts
    .map(([name, n], i) => {
      const y = 120 + i * 62
      const bw = Math.round((n / max) * 330)
      return `
    <text x="0" y="${y}" font-size="15" font-weight="600" fill="${P.text}">${esc(name)}</text>
    <text x="400" y="${y}" font-size="15" font-weight="800" text-anchor="end" fill="${COLORS[i]}">${n}</text>
    <rect x="0" y="${y + 10}" width="400" height="12" rx="6" fill="${P.purple}" fill-opacity=".14"/>
    <rect x="0" y="${y + 10}" width="${bw}" height="12" rx="6" fill="${COLORS[i]}" style="transform-box:fill-box;transform-origin:left;transform:scaleX(0);animation:grow 1.1s ${0.3 + i * 0.2}s ease-out forwards" filter="drop-shadow(0 0 4px ${COLORS[i]})"/>`
    })
    .join("")
  const legend = counts
    .map(([name], i) => `<g transform="translate(0 ${i * 26})"><rect width="12" height="12" rx="3" y="-10" fill="${COLORS[i]}"/><text x="22" y="0" font-size="13" fill="${P.soft}">${esc(name)}</text></g>`)
    .join("")
  const body = `
  ${backdrop(w, h, "c")}
  <text x="40" y="54" font-size="24" font-weight="800" fill="${P.text}">Stack Breakdown</text>
  <rect x="40" y="66" width="70" height="4" rx="2" fill="${P.magenta}"/>
  <g transform="translate(190 218)">
    <circle r="${R}" fill="none" stroke="${P.purple}" stroke-opacity=".12" stroke-width="30"/>
    ${segs}
    <text y="6" font-size="40" font-weight="800" text-anchor="middle" fill="${P.text}" class="glowtxt">${total}</text>
    <text y="30" font-size="12" letter-spacing="3" text-anchor="middle" fill="${P.soft}">TOOLS</text>
  </g>
  <g transform="translate(60 330)">${legend.replace(/translate\(0 (\d+)\)/g, (_, n) => `translate(${(n / 26) * 0 + 0} ${0})`)}</g>
  <g transform="translate(470 50)">${bars}</g>`
  // legend laid out horizontally under the donut instead
  const legendRow = counts
    .map(([name], i) => `<g transform="translate(${[0, 78, 168, 260][i]} 0)"><rect width="10" height="10" rx="3" y="-9" fill="${COLORS[i]}"/><text x="16" y="0" font-size="11" fill="${P.soft}">${esc(name.split(" ")[0])}</text></g>`)
    .join("")
  const body2 = body.replace(/<g transform="translate\(60 330\)">[\s\S]*?<\/g><\/g>/, `<g transform="translate(60 345)">${legendRow}</g>`)
  writeFileSync(join(out, "stack-charts.svg"), svg(w, h, body2, "@keyframes draw{to{stroke-dasharray:var(--l) 1000}}", "c"))
}

/* ---------- 5. DIVIDER ---------- */
writeFileSync(
  join(out, "divider.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="24" viewBox="0 0 900 24"><style>
  @keyframes run{from{stroke-dashoffset:0}to{stroke-dashoffset:-120}}
  .l{animation:run 3s linear infinite}
  @media (prefers-reduced-motion: reduce){.l{animation:none}}</style>
  <line x1="0" y1="12" x2="900" y2="12" stroke="${P.purple}" stroke-opacity=".3"/>
  <line class="l" x1="0" y1="12" x2="900" y2="12" stroke="${P.magenta}" stroke-width="3" stroke-dasharray="40 80" stroke-linecap="round"/>
  <circle cx="450" cy="12" r="5" fill="${P.pink}"/></svg>`
)

console.log("assets written to", out)
