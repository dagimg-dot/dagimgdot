import { CONFIG } from "./types";

const CHAR_POOLS = {
  ethiopic: "ሀሁሂሃሄህሆለሉሊላሌልሎሐሑሒሓሔሕሖመሙሚማሜምሞሰሱሲሳሴስሶ",
  latin: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  cyrillic: "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзий",
  arabic: "ابتثجحخدذرزسشصضطظعغفقكلمنهوي",
  cjk: "你好世界天地人大小中上下左右前后東西南北春夏秋冬",
  devanagari: "अआइईउऊएऐओऔकखगघचछजझटठडढणतथदधनपफबभमय",
  symbols: "◈◉◊○●□■△▽☆★♠♣♥♦⚡⚙✦✧✶✹✺❖",
} as const;

const ALL_CHARS = Object.values(CHAR_POOLS).join("");

function randomChar(): string {
  return ALL_CHARS[Math.floor(Math.random() * ALL_CHARS.length)];
}

export interface DecipherOptions {
  element: HTMLElement;
  targetText: string;
  duration?: number;
  tickInterval?: number;
}

export function runDecipher({
  element,
  targetText,
  duration = CONFIG.DECIPHER.DURATION_MS,
  tickInterval = CONFIG.DECIPHER.TICK_INTERVAL_MS,
}: DecipherOptions): Promise<void> {
  return new Promise((resolve) => {
    const targetChars = [...targetText];
    const len = targetChars.length;
    const totalTicks = Math.floor(duration / tickInterval);
    const locked: boolean[] = new Array(len).fill(false);
    let tick = 0;

    const interval = setInterval(() => {
      tick++;
      const progress = tick / totalTicks;
      const lockedCount = Math.floor(progress * len);

      for (let i = 0; i < lockedCount && i < len; i++) {
        locked[i] = true;
      }

      element.textContent = targetChars
        .map((char, i) => (locked[i] ? char : randomChar()))
        .join("");

      if (tick >= totalTicks) {
        clearInterval(interval);
        element.textContent = targetText;
        resolve();
      }
    }, tickInterval);
  });
}
