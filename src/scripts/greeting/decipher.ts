import { CONFIG } from "./types";

const SYMBOL_POOL = "!<>-_\\/[]{}—=+*^?#_░▒▓◈◉✦✧";

const SCRIPT_POOLS: Record<string, string> = {
  am: "ሀሁሂሃሄህሆለሉሊላሌልሎሐሑሒሓሔሕሖመሙሚማሜምሞሰሱሲሳሴስሶ",
  ja: "あいうえおかきくけこさしすせそたちつてとなにぬねの",
  zh: "你好世界天地人大小中上下左右前后",
  ar: "ابتثجحخدذرزسشصضطظعغفقكلمنهوي",
  ru: "абвгдежзийклмнопрстуфхцчшщъыьэюя",
  el: "αβγδεζηθικλμνξοπρστυφχψω",
  hi: "अआइईउऊएऐओऔकखगघचछजझटठडढ",
};

function getScramblePool(targetText: string): string {
  // Find matching script pool or default to symbols + latin
  for (const char of targetText) {
    const code = char.charCodeAt(0);
    if (code >= 0x1200 && code <= 0x137f) return SCRIPT_POOLS.am + SYMBOL_POOL;
    if (code >= 0x3040 && code <= 0x30ff) return SCRIPT_POOLS.ja + SYMBOL_POOL;
    if (code >= 0x4e00 && code <= 0x9fff) return SCRIPT_POOLS.zh + SYMBOL_POOL;
    if (code >= 0x0600 && code <= 0x06ff) return SCRIPT_POOLS.ar + SYMBOL_POOL;
    if (code >= 0x0400 && code <= 0x04ff) return SCRIPT_POOLS.ru + SYMBOL_POOL;
    if (code >= 0x0900 && code <= 0x097f) return SCRIPT_POOLS.hi + SYMBOL_POOL;
  }
  return "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" + SYMBOL_POOL;
}

export interface DecipherOptions {
  element: HTMLElement;
  targetText: string;
  duration?: number;
}

export function runDecipher({
  element,
  targetText,
  duration = CONFIG.DECIPHER.DURATION_MS,
}: DecipherOptions): Promise<void> {
  return new Promise((resolve) => {
    // Respect reduced motion settings
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.textContent = targetText;
      resolve();
      return;
    }

    const pool = getScramblePool(targetText);
    const targetChars = [...targetText];
    const len = targetChars.length;

    const getRandomChar = () => pool[Math.floor(Math.random() * pool.length)];

    let startTime: number | null = null;
    let lastScrambleTime = 0;
    const scrambleIntervalMs = 65; // Smooth 65ms scramble rate (eye-friendly)

    // Current displayed array of characters
    const currentChars = targetChars.map(() => getRandomChar());

    function step(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out progress curve for smooth lock-in pacing
      const easedProgress = Math.sin((progress * Math.PI) / 2);
      const lockedCount = Math.floor(easedProgress * len);

      // Update un-locked random characters at controlled interval
      const shouldScramble = timestamp - lastScrambleTime >= scrambleIntervalMs;
      if (shouldScramble) {
        lastScrambleTime = timestamp;
      }

      for (let i = 0; i < len; i++) {
        if (i < lockedCount) {
          currentChars[i] = targetChars[i];
        } else if (shouldScramble) {
          currentChars[i] = getRandomChar();
        }
      }

      element.textContent = currentChars.join("");

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = targetText;
        resolve();
      }
    }

    requestAnimationFrame(step);
  });
}
