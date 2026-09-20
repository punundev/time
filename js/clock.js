class ClockEngine {
  constructor(settingsManager) {
    this.settings = settingsManager;
    this.callbacks = [];
    this.animationFrameId = null;
    this.lastSecond = -1;
    this.lastMinute = -1;
    this.lastDay = -1;

    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    this.tick = this.tick.bind(this);

    document.addEventListener("visibilitychange", this.onVisibilityChange);
  }

  start() {
    if (!this.animationFrameId) {
      this.tick();
    }
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  onVisibilityChange() {
    if (!document.hidden) {
      this.notify(new Date(), true);
    }
  }

  subscribe(callback) {
    this.callbacks.push(callback);
    callback(new Date(), true);
  }

  tick() {
    const now = new Date();
    const currentSecond = now.getSeconds();
    const currentMinute = now.getMinutes();
    const currentDay = now.getDate();

    const secondChanged = currentSecond !== this.lastSecond;
    const minuteChanged = currentMinute !== this.lastMinute;
    const dayChanged = currentDay !== this.lastDay;

    this.lastSecond = currentSecond;
    this.lastMinute = currentMinute;
    this.lastDay = currentDay;

    this.notify(now, secondChanged, minuteChanged, dayChanged);
    this.animationFrameId = requestAnimationFrame(this.tick);
  }

  notify(now, secondChanged, minuteChanged, dayChanged) {
    for (let i = 0; i < this.callbacks.length; i++) {
      this.callbacks[i](now, { secondChanged, minuteChanged, dayChanged });
    }
  }

  static toKhmerDigits(str) {
    const khDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    return String(str).replace(/\d/g, (d) => khDigits[parseInt(d, 10)]);
  }

  static formatDigital(now, settings) {
    const is12h = settings.timeFormat === "12h";
    let hours = now.getHours();
    let ampm = "";

    if (is12h) {
      ampm = hours >= 12 ? (settings.language === "kh" ? "ល្ងាច" : "PM") : (settings.language === "kh" ? "ព្រឹក" : "AM");
      hours = hours % 12 || 12;
    }

    let hStr = String(hours).padStart(2, "0");
    let mStr = String(now.getMinutes()).padStart(2, "0");
    let sStr = String(now.getSeconds()).padStart(2, "0");

    if (settings.language === "kh") {
      hStr = ClockEngine.toKhmerDigits(hStr);
      mStr = ClockEngine.toKhmerDigits(mStr);
      sStr = ClockEngine.toKhmerDigits(sStr);
    }

    return {
      hours: hStr,
      minutes: mStr,
      seconds: sStr,
      ampm: ampm,
      showSeconds: settings.showSeconds
    };
  }

  static formatDate(now, settings) {
    const isKh = settings.language === "kh";
    const locale = isKh ? "km-KH" : "en-US";
    const format = settings.dateFormat || "full";
    let dateStr = "";

    const optionsMap = {
      full: { month: "long", day: "numeric", year: "numeric" },
      short: { month: "short", day: "numeric" },
      iso: { year: "numeric", month: "2-digit", day: "2-digit" },
      us: { month: "2-digit", day: "2-digit", year: "numeric" }
    };

    if (format === "iso") {
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const d = String(now.getDate()).padStart(2, "0");
      dateStr = `${y}-${m}-${d}`;
    } else if (format === "us") {
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const d = String(now.getDate()).padStart(2, "0");
      dateStr = `${m}/${d}/${y}`;
    } else {
      dateStr = now.toLocaleDateString(locale, optionsMap[format] || optionsMap.full);
    }

    if (isKh) {
      dateStr = ClockEngine.toKhmerDigits(dateStr);
    }

    let weekday = now.toLocaleDateString(locale, { weekday: "long" });
    if (!isKh) {
      if (settings.dayCase === "uppercase") {
        weekday = weekday.toUpperCase();
      } else if (settings.dayCase === "lowercase") {
        weekday = weekday.toLowerCase();
      }
    }

    return { weekday, dateStr };
  }
}

window.ClockEngine = ClockEngine;
