const DEFAULT_SETTINGS = {
  clockMode: "digital",
  timeFormat: "24h",
  showSeconds: true,
  showDate: true,
  dateFormat: "full",
  dayCase: "uppercase",
  showWeather: true,
  weatherLocation: "Siem Reap",
  showBattery: true,
  showNetwork: true,
  showTimezone: false,
  theme: "midnight",
  accent: "white",
  colorScheme: "dark",
  language: "en",
  wallpaperUrl: "",
  digitalStyle: "modern",
  digitalFontSize: 100,
  analogStyle: "minimal",
  nightMode: "off",
  ambientMode: false,
  wakeLock: true,
  fullscreen: false,
  worldClocks: ["Asia/Phnom_Penh", "Asia/Tokyo", "Europe/London", "America/New_York"]
};

class SettingsManager {
  constructor() {
    this.storageKey = "smartClock.settings";
    this.listeners = [];
    this.settings = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      let parsed = {};
      if (raw) {
        parsed = JSON.parse(raw);
      }
      const cookieWallpaper = this.getCookie("smartClock.wallpaper");
      if (cookieWallpaper) {
        parsed.wallpaperUrl = cookieWallpaper;
      }
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (e) {
      return { ...DEFAULT_SETTINGS };
    }
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
      if (this.settings.wallpaperUrl) {
        this.setCookie("smartClock.wallpaper", this.settings.wallpaperUrl);
      } else {
        this.deleteCookie("smartClock.wallpaper");
      }
      this.notify();
    } catch (e) {}
  }

  get(key) {
    return this.settings[key];
  }

  set(key, value) {
    this.settings[key] = value;
    this.save();
  }

  update(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.save();
  }

  reset() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.deleteCookie("smartClock.wallpaper");
    this.save();
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach((fn) => fn(this.settings));
  }

  setCookie(name, value, days = 365) {
    try {
      const d = new Date();
      d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Strict`;
    } catch (e) {}
  }

  getCookie(name) {
    try {
      const nameEQ = name + "=";
      const ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    } catch (e) {}
    return null;
  }

  deleteCookie(name) {
    try {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict`;
    } catch (e) {}
  }
}

window.settingsManager = new SettingsManager();
