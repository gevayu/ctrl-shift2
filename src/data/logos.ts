// 📖 Docs: obsidian/frontend/content.md

/**
 * Logo carousels on the home page. Every file is a white silhouette on
 * transparent, trimmed to its ink (made from the client's Drive folders,
 * 2026-10-10), so one CSS opacity turns them all the same grey. `w`/`h` are
 * the file's pixel size; the carousel sizes each logo by equal visual area.
 */
export interface Logo {
  slug: string;
  /** The company, for alt text and the screen-reader list. */
  name: string;
  w: number;
  h: number;
}

export const logos = {
  clients: {
    title: "חברות שבחרו לצמוח איתנו",
    dir: "/assets/logos/clients",
    items: [
    { slug: "dorit-gabay", name: "דורית גבאי רו\"ח", w: 384, h: 95 },
    { slug: "burger-station", name: "בורגר סטיישן", w: 820, h: 420 },
    { slug: "fitel", name: "פיטל", w: 290, h: 97 },
    { slug: "gadget-shop", name: "גאדג'אט שופ", w: 590, h: 126 },
    { slug: "agor", name: "אגור הנדסה", w: 446, h: 285 },
    { slug: "liel-yamin", name: "ליאל ימין שמלות כלה", w: 828, h: 270 },
    { slug: "tal-nathan", name: "טל נתן הפקות אירועים", w: 861, h: 276 },
    { slug: "sandwich-bar", name: "סנדוויץ' בר", w: 724, h: 725 },
    { slug: "ninja-school", name: "נינג'ה סקול", w: 571, h: 218 },
    { slug: "pola", name: "פולה פולארויד", w: 192, h: 192 },
    { slug: "prime-medics", name: "Prime Medics", w: 478, h: 232 },
    { slug: "sergio", name: "מכללת סרג'יו", w: 483, h: 189 },
    { slug: "adama-games", name: "משחקי האדמה ומרחבי התחושה", w: 348, h: 81 },
    { slug: "toplevel", name: "TopLevel נדל\"ן", w: 476, h: 121 },
    { slug: "ttf", name: "משכנתאות TTF", w: 182, h: 161 },
    { slug: "akila", name: "Akila", w: 475, h: 168 },
    { slug: "4sale", name: "רוני שטיגליץ 4sale", w: 961, h: 469 },
    ] satisfies Logo[],
  },
  partners: {
    /** The implementation page's own heading for the same four systems. */
    title: "המערכות שאנחנו מטמיעים",
    dir: "/assets/logos/partners",
    items: [
    { slug: "monday", name: "Monday", w: 1008, h: 162 },
    { slug: "fireberry", name: "Fireberry", w: 872, h: 194 },
    { slug: "origami", name: "אוריגמי", w: 654, h: 216 },
    { slug: "zoho", name: "Zoho", w: 744, h: 321 },
    ] satisfies Logo[],
  },
} as const;
