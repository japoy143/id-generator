import { Student, CardSettings } from "./types";

export function buildPrintHTML(
  students: Student[],
  frontFrame: string | null,
  backFrame: string | null,
  settings: CardSettings,
): string {
  const {
    cardWidth,
    cardHeight,
    photoLeft,
    photoTop,
    photoWidth,
    photoHeight,
    textFields,
    cardGap = 0.1,
    backLayoutMode = "mirror-rows",
  } = settings;

  // Gap is applied as margin on each card; both sides of gap = cardGap/2 each side
  const halfGap = cardGap / 2;

  // How many cards fit per row/col accounting for gaps
  const perRow = Math.floor((8.5 - 0.5) / (cardWidth + cardGap));
  const perCol = Math.floor((11 - 0.5) / (cardHeight + cardGap));
  const perPage = Math.max(1, perRow * perCol);

  const cardStyle = `
    width:${cardWidth}in;
    height:${cardHeight}in;
    position:relative;
    overflow:hidden;
    display:inline-block;
    vertical-align:top;
    border:0.5pt solid #ccc;
    background:#fff;
    margin:${halfGap}in;
  `;

  const frameImg = (src: string | null) =>
    src
      ? `<img src="${src}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:fill;" />`
      : "";

  const photoImg = (src: string | null) =>
    src
      ? `<img src="${src}" style="position:absolute;left:${photoLeft}%;top:${photoTop}%;width:${photoWidth}%;height:${photoHeight}%;object-fit:cover;object-position:center top;" />`
      : "";

  const textBoxes = (student: Student, side: "front" | "back") =>
    textFields
      .filter((f) => f.side === side)
      .map((f) => {
        const value = (student[f.field] || "").toString();
        const justify =
          f.align === "left"
            ? "flex-start"
            : f.align === "right"
              ? "flex-end"
              : "center";
        // Use per-field fontFamily, fall back to Arial
        const font = f.fontFamily || "Arial, Helvetica, sans-serif";
        return `<div style="
  position:absolute;
  left:${f.left}%; top:${f.top}%; width:${f.width}%; height:${f.height}%;
  display:flex; align-items:flex-start; justify-content:${justify};
  font-size:${f.fontSize}pt;
  font-weight:${f.bold ? 700 : 400};
  font-family:${font};
  text-transform:${f.uppercase ? "uppercase" : "none"};
  text-align:${f.align};
  color:#1a1a1a;
  line-height:1.15;
  white-space:pre-wrap; overflow:hidden; word-break:break-word;
">${escapeHTML(value)}</div>`;
      })
      .join("");

  // Reverses the order of cards within each row of a chunk. Used so that,
  // after printing front/back pages separately and cutting individual
  // cards, flipping a card left-to-right lines its back up with its front.
  function mirrorRow(chunk: Student[]): Student[] {
    const mirrored: Student[] = [];
    for (let r = 0; r < chunk.length; r += perRow) {
      mirrored.push(...chunk.slice(r, r + perRow).reverse());
    }
    return mirrored;
  }

  function orderForBack(chunk: Student[]): Student[] {
    if (backLayoutMode === "mirror-rows") return mirrorRow(chunk);
    // "same-order" and "duplex" both keep the original order today.
    return chunk;
  }

  const pages: string[] = [];

  // Front pages
  for (let p = 0; p < students.length; p += perPage) {
    const chunk = students.slice(p, p + perPage);
    const cells = chunk
      .map(
        (s) => `<div style="${cardStyle}">
          ${frameImg(frontFrame)}
          ${photoImg(s.photo)}
          ${textBoxes(s, "front")}
        </div>`,
      )
      .join("");
    pages.push(
      `<div style="width:8.5in;min-height:11in;page-break-after:always;padding:0.25in;line-height:0;">${cells}</div>`,
    );
  }

  // Back pages — ordering depends on backLayoutMode (see orderForBack above)
  for (let p = 0; p < students.length; p += perPage) {
    const chunk = students.slice(p, p + perPage);
    const ordered = orderForBack(chunk);
    const cells = ordered
      .map(
        (s) => `<div style="${cardStyle}">
          ${frameImg(backFrame)}
          ${textBoxes(s, "back")}
        </div>`,
      )
      .join("");
    pages.push(
      `<div style="width:8.5in;min-height:11in;page-break-after:always;padding:0.25in;line-height:0;">${cells}</div>`,
    );
  }

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
  @page { size: 8.5in 11in; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: white; font-size: 0; line-height: 0; }
</style>
</head>
<body>${pages.join("")}</body>
</html>`;
}

function escapeHTML(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function triggerPrint(html: string) {
  const win = window.open("", "_blank", "width=960,height=720");
  if (!win) {
    alert("Pop-up blocked. Please allow pop-ups for this site and try again.");
    return;
  }
  win.document.write(html);
  win.document.close();
  // Give fonts a moment to load before printing
  win.onload = () => {
    win.focus();
    setTimeout(() => win.print(), 500);
  };
}
