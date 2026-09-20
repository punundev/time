const DEFAULT_SETTINGS = {
  clockMode: "hybrid",
  timeFormat: "24h",
  showSeconds: true,
  showDate: true,
  dateFormat: "full",
  dayCase: "uppercase",
  showWeather: true,
  showBattery: true,
  showNetwork: true,
  showTimezone: false,
  theme: "midnight",
  accent: "white",
  digitalStyle: "modern",
  analogStyle: "minimal",
  nightMode: "auto",
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
      if (!raw) return { ...DEFAULT_SETTINGS };
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (e) {
      return { ...DEFAULT_SETTINGS };
    }
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
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
    this.save();
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach((fn) => fn(this.settings));
  }
}

window.settingsManager = new SettingsManager();
