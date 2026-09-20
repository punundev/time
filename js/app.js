const TRANSLATIONS = {
  en: {
    rotateTitle: "Rotate Your Device",
    rotateDesc: "Smart Clock is optimized for landscape orientation.",
    continuePortrait: "Continue in Portrait Anyway",
    settingsTitle: "Clock Settings",
    clockMode: "Clock Mode",
    timeFormat: "Time Format",
    showSeconds: "Show Seconds",
    showDate: "Show Date",
    digitalStyle: "Digital Style",
    analogStyle: "Analog Style",
    fontSize: "Digital Font Size",
    colorTheme: "Color Theme",
    accentColor: "Accent Color",
    language: "Language",
    wallpaperUrl: "Wallpaper Image URL",
    weather: "Weather",
    battery: "Battery",
    network: "Network Status",
    timezone: "Timezone Tag",
    nightMode: "Night Mode",
    keepAwake: "Keep Screen Awake",
    resetSettings: "Reset All Settings",
    done: "Done",
    digitalOnly: "Digital Only",
    analogOnly: "Analog Only",
    hybrid: "Hybrid (Digital + Analog)",
    dashboard: "Dashboard",
    ambient: "Ambient",
    h24: "24-Hour",
    h12: "12-Hour",
    auto: "Auto (22:00 - 07:00)",
    on: "Always On",
    off: "Off"
  },
  kh: {
    rotateTitle: "សូមបង្វិលឧបករណ៍របស់អ្នក",
    rotateDesc: "នាឡិកាឆ្លាតវៃត្រូវបានបង្កើតឡើងយ៉ាងល្អឥតខ្ចោះសម្រាប់ទម្រង់ផ្ដេក។",
    continuePortrait: "បន្តប្រើក្នុងទម្រង់ឈរ",
    settingsTitle: "ការកំណត់នាឡិកា",
    clockMode: "ទម្រង់នាឡិកា",
    timeFormat: "ទម្រង់ម៉ោង",
    showSeconds: "បង្ហាញវិនាទី",
    showDate: "បង្ហាញថ្ងៃខែ",
    digitalStyle: "រចនាប័ទ្មឌីជីថល",
    analogStyle: "រចនាប័ទ្មទ្រនិច",
    fontSize: "ទំហំអក្សរឌីជីថល",
    colorTheme: "ពណ៌ប្រធានបទ",
    accentColor: "ពណ៌លេចធ្លោ",
    language: "ភាសា",
    wallpaperUrl: "តំណភ្ជាប់រូបភាពផ្ទៃខាងក្រោយ (URL)",
    weather: "ធាតុអាកាស",
    battery: "កម្រិតថ្ម",
    network: "ស្ថានភាពបណ្តាញ",
    timezone: "ល្វែងម៉ោង",
    nightMode: "របៀបយប់",
    keepAwake: "រក្សាអេក្រង់ឱ្យភ្លឺ",
    resetSettings: "កំណត់ឡើងវិញ",
    done: "រួចរាល់",
    digitalOnly: "ឌីជីថលប៉ុណ្ណោះ",
    analogOnly: "ទ្រនិចប៉ុណ្ណោះ",
    hybrid: "ចម្រុះ (ឌីជីថល + ទ្រនិច)",
    dashboard: "ផ្ទាំងព័ត៌មាន",
    ambient: "អប្បបរមា",
    h24: "២៤ ម៉ោង",
    h12: "១២ ម៉ោង",
    auto: "ស្វ័យប្រវត្តិ (22:00 - 07:00)",
    on: "បើករហូត",
    off: "បិទ"
  }
};

class SmartClockApp {
  constructor() {
    this.settings = window.settingsManager;
    this.clockEngine = new ClockEngine(this.settings);
    this.weatherService = new WeatherService(this.settings);
    this.deviceService = new DeviceService(this.settings);
    this.wakeLock = new WakeLockManager(this.settings);
    this.worldClock = new WorldClockService(this.settings);

    this.inactivityTimeout = null;
    this.inactivityDelay = 5000;
    this.touchStartY = 0;
    this.touchStartX = 0;
    this.dismissedPortrait = false;

    this.initDOM();
    this.initAnalogClock();
    this.bindEvents();
    this.applySettings();
    this.checkOrientation();

    this.clockEngine.subscribe((now, info) => this.onClockTick(now, info));
    this.weatherService.onUpdate((data) => this.renderWeather(data));
    this.deviceService.onUpdate((data) => this.renderDevice(data));

    this.clockEngine.start();
    this.weatherService.fetchWeather();
    this.wakeLock.request();
    this.resetInactivityTimer();
  }

  initDOM() {
    this.elements = {
      appContainer: document.getElementById("appContainer"),
      digitalContainer: document.getElementById("digitalClockContainer"),
      analogContainer: document.getElementById("analogClockContainer"),
      worldContainer: document.getElementById("worldClockContainer"),
      worldList: document.getElementById("worldClockList"),
      hoursEl: document.getElementById("hoursEl"),
      minutesEl: document.getElementById("minutesEl"),
      secondsEl: document.getElementById("secondsEl"),
      secondsWrapper: document.getElementById("secondsWrapper"),
      ampmEl: document.getElementById("ampmEl"),
      dateEl: document.getElementById("dateEl"),
      weekdayEl: document.getElementById("weekdayEl"),
      dateHeader: document.getElementById("dateHeader"),
      weatherContainer: document.getElementById("weatherContainer"),
      weatherIcon: document.getElementById("weatherIcon"),
      weatherTemp: document.getElementById("weatherTemp"),
      weatherCond: document.getElementById("weatherCond"),
      batteryContainer: document.getElementById("batteryContainer"),
      batteryIcon: document.getElementById("batteryIcon"),
      batteryLevel: document.getElementById("batteryLevel"),
      networkContainer: document.getElementById("networkContainer"),
      networkStatusIcon: document.getElementById("networkStatusIcon"),
      timezoneEl: document.getElementById("timezoneEl"),
      controlsOverlay: document.getElementById("controlsOverlay"),
      settingsModal: document.getElementById("settingsModal"),
      openSettingsBtn: document.getElementById("openSettingsBtn"),
      closeSettingsBtn: document.getElementById("closeSettingsBtn"),
      saveSettingsCloseBtn: document.getElementById("saveSettingsCloseBtn"),
      resetSettingsBtn: document.getElementById("resetSettingsBtn"),
      toggleModeBtn: document.getElementById("toggleModeBtn"),
      toggleNightBtn: document.getElementById("toggleNightBtn"),
      toggleAmbientBtn: document.getElementById("toggleAmbientBtn"),
      toggleFullscreenBtn: document.getElementById("toggleFullscreenBtn"),
      dismissWarningBtn: document.getElementById("dismissWarningBtn"),
      portraitWarning: document.getElementById("portraitWarning"),
      wallpaperLayer: document.getElementById("wallpaperLayer"),
      settingWallpaperUrl: document.getElementById("settingWallpaperUrl"),
      clearWallpaperBtn: document.getElementById("clearWallpaperBtn"),
      settingDigitalFontSize: document.getElementById("settingDigitalFontSize"),
      fontSizeVal: document.getElementById("fontSizeVal")
    };
  }

  initAnalogClock() {
    this.analogClock = new AnalogClock(this.elements.analogContainer, this.settings);
  }

  bindEvents() {
    window.addEventListener("resize", () => this.checkOrientation());
    window.addEventListener("orientationchange", () => this.checkOrientation());

    if (this.elements.dismissWarningBtn) {
      this.elements.dismissWarningBtn.addEventListener("click", () => {
        this.dismissedPortrait = true;
        this.checkOrientation();
      });
    }

    const handleActivity = () => this.resetInactivityTimer();
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("touchstart", (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      handleActivity();
    });
    window.addEventListener("touchend", (e) => this.handleGesture(e));

    window.addEventListener("keydown", (e) => this.handleKeydown(e));

    this.elements.openSettingsBtn.addEventListener("click", () => this.openSettings());
    this.elements.closeSettingsBtn.addEventListener("click", () => this.closeSettings());
    this.elements.saveSettingsCloseBtn.addEventListener("click", () => this.closeSettings());
    this.elements.resetSettingsBtn.addEventListener("click", () => {
      if (confirm("Reset all settings to default?")) {
        this.settings.reset();
        this.applySettings();
        this.syncSettingsUI();
        this.closeSettings();
      }
    });

    if (this.elements.clearWallpaperBtn) {
      this.elements.clearWallpaperBtn.addEventListener("click", () => {
        this.settings.set("wallpaperUrl", "");
        this.elements.settingWallpaperUrl.value = "";
        this.applyWallpaper("");
      });
    }

    this.elements.toggleModeBtn.addEventListener("click", () => this.cycleMode());
    this.elements.toggleNightBtn.addEventListener("click", () => {
      const cur = this.settings.get("nightMode");
      const next = cur === "on" ? "off" : "on";
      this.settings.set("nightMode", next);
      this.applySettings();
    });
    this.elements.toggleAmbientBtn.addEventListener("click", () => {
      const cur = this.settings.get("ambientMode");
      this.settings.set("ambientMode", !cur);
      this.applySettings();
    });
    this.elements.toggleFullscreenBtn.addEventListener("click", () => {
      window.fullscreenManager.toggle();
    });

    this.settings.onChange(() => this.applySettings());

    this.bindSettingsForm();
  }

  bindSettingsForm() {
    const s = this.settings;
    const bindSelect = (id, key) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("change", (e) => s.set(key, e.target.value));
    };
    const bindCheck = (id, key) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("change", (e) => s.set(key, e.target.checked));
    };

    bindSelect("settingClockMode", "clockMode");
    bindSelect("settingTimeFormat", "timeFormat");
    bindCheck("settingShowSeconds", "showSeconds");
    bindCheck("settingShowDate", "showDate");
    bindSelect("settingDigitalStyle", "digitalStyle");
    bindSelect("settingAnalogStyle", "analogStyle");
    bindSelect("settingTheme", "theme");
    bindSelect("settingAccent", "accent");
    bindSelect("settingColorScheme", "colorScheme");
    bindSelect("settingLanguage", "language");
    bindCheck("settingShowWeather", "showWeather");
    bindCheck("settingShowBattery", "showBattery");
    bindCheck("settingShowNetwork", "showNetwork");
    bindCheck("settingShowTimezone", "showTimezone");
    bindSelect("settingNightMode", "nightMode");
    bindCheck("settingWakeLock", "wakeLock");

    if (this.elements.settingDigitalFontSize) {
      this.elements.settingDigitalFontSize.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        s.set("digitalFontSize", val);
        if (this.elements.fontSizeVal) {
          this.elements.fontSizeVal.textContent = `${val}%`;
        }
        document.documentElement.style.setProperty("--digital-font-scale", val / 100);
      });
    }

    if (this.elements.settingWallpaperUrl) {
      this.elements.settingWallpaperUrl.addEventListener("change", (e) => {
        s.set("wallpaperUrl", e.target.value.trim());
        this.applyWallpaper(e.target.value.trim());
      });
    }
  }

  syncSettingsUI() {
    const s = this.settings;
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };
    const setChecked = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = val;
    };

    setVal("settingClockMode", s.get("clockMode"));
    setVal("settingTimeFormat", s.get("timeFormat"));
    setChecked("settingShowSeconds", s.get("showSeconds"));
    setChecked("settingShowDate", s.get("showDate"));
    setVal("settingDigitalStyle", s.get("digitalStyle"));
    setVal("settingAnalogStyle", s.get("analogStyle"));
    setVal("settingTheme", s.get("theme"));
    setVal("settingAccent", s.get("accent"));
    setVal("settingColorScheme", s.get("colorScheme") || "dark");
    setVal("settingLanguage", s.get("language") || "en");
    setVal("settingWallpaperUrl", s.get("wallpaperUrl") || "");

    const fontSize = s.get("digitalFontSize") || 100;
    setVal("settingDigitalFontSize", fontSize);
    if (this.elements.fontSizeVal) {
      this.elements.fontSizeVal.textContent = `${fontSize}%`;
    }

    setChecked("settingShowWeather", s.get("showWeather"));
    setChecked("settingShowBattery", s.get("showBattery"));
    setChecked("settingShowNetwork", s.get("showNetwork"));
    setChecked("settingShowTimezone", s.get("showTimezone"));
    setVal("settingNightMode", s.get("nightMode"));
    setChecked("settingWakeLock", s.get("wakeLock"));
  }

  openSettings() {
    this.syncSettingsUI();
    if (this.elements.settingsModal.showModal) {
      this.elements.settingsModal.showModal();
    }
  }

  closeSettings() {
    if (this.elements.settingsModal.close) {
      this.elements.settingsModal.close();
    }
  }

  resetInactivityTimer() {
    this.elements.controlsOverlay.classList.remove("hidden-controls");
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      if (!this.elements.settingsModal.open) {
        this.elements.controlsOverlay.classList.add("hidden-controls");
      }
    }, this.inactivityDelay);
  }

  handleGesture(e) {
    if (this.elements.settingsModal.open) return;
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = endX - this.touchStartX;
    const diffY = endY - this.touchStartY;

    if (Math.abs(diffX) > 80 && Math.abs(diffX) > Math.abs(diffY)) {
      this.cycleMode();
    }
  }

  handleKeydown(e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;

    switch (e.key.toLowerCase()) {
      case "f":
        window.fullscreenManager.toggle();
        break;
      case "s":
        this.settings.set("showSeconds", !this.settings.get("showSeconds"));
        break;
      case "a":
        this.settings.set("clockMode", "analog");
        break;
      case "d":
        this.settings.set("clockMode", "digital");
        break;
      case "n":
        const curN = this.settings.get("nightMode");
        this.settings.set("nightMode", curN === "on" ? "off" : "on");
        break;
      case "m":
        this.settings.set("ambientMode", !this.settings.get("ambientMode"));
        break;
      case "escape":
        this.closeSettings();
        break;
      case " ":
        e.preventDefault();
        this.elements.controlsOverlay.classList.toggle("hidden-controls");
        break;
    }
  }

  cycleMode() {
    const modes = ["hybrid", "digital", "analog", "dashboard", "ambient"];
    const cur = this.settings.get("clockMode");
    const nextIdx = (modes.indexOf(cur) + 1) % modes.length;
    this.settings.set("clockMode", modes[nextIdx]);
  }

  applySettings() {
    const s = this.settings;
    document.body.dataset.theme = s.get("theme");
    document.body.dataset.accent = s.get("accent");
    document.body.dataset.colorScheme = s.get("colorScheme") || "dark";

    const fontSize = s.get("digitalFontSize") || 100;
    document.documentElement.style.setProperty("--digital-font-scale", fontSize / 100);

    this.applyLanguage(s.get("language") || "en");
    this.applyWallpaper(s.get("wallpaperUrl") || "");

    const digitalStyle = s.get("digitalStyle") || "modern";
    this.elements.digitalContainer.className = `flex flex-col items-center justify-center text-center transition-all duration-300 font-style-${digitalStyle}`;

    const mode = s.get("ambientMode") ? "ambient" : s.get("clockMode");

    if (mode === "ambient") {
      this.elements.digitalContainer.style.display = "flex";
      this.elements.analogContainer.style.display = "none";
      this.elements.worldContainer.style.display = "none";
      this.elements.dateHeader.style.display = "none";
    } else if (mode === "digital") {
      this.elements.digitalContainer.style.display = "flex";
      this.elements.analogContainer.style.display = "none";
      this.elements.worldContainer.style.display = "none";
      this.elements.dateHeader.style.display = s.get("showDate") ? "flex" : "none";
    } else if (mode === "analog") {
      this.elements.digitalContainer.style.display = "none";
      this.elements.analogContainer.style.display = "flex";
      this.elements.worldContainer.style.display = "none";
      this.elements.dateHeader.style.display = s.get("showDate") ? "flex" : "none";
    } else if (mode === "hybrid") {
      this.elements.digitalContainer.style.display = "flex";
      this.elements.analogContainer.style.display = "flex";
      this.elements.worldContainer.style.display = "none";
      this.elements.dateHeader.style.display = s.get("showDate") ? "flex" : "none";
    } else if (mode === "dashboard") {
      this.elements.digitalContainer.style.display = "flex";
      this.elements.analogContainer.style.display = "flex";
      this.elements.worldContainer.style.display = "flex";
      this.elements.dateHeader.style.display = s.get("showDate") ? "flex" : "none";
    }

    if (s.get("wakeLock")) {
      this.wakeLock.request();
    } else {
      this.wakeLock.release();
    }

    this.analogClock.renderDialStyle();
    this.evaluateNightMode();
  }

  applyLanguage(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });
  }

  applyWallpaper(url) {
    if (url) {
      this.elements.wallpaperLayer.style.backgroundImage = `url('${url}')`;
      this.elements.wallpaperLayer.classList.remove("hidden");
    } else {
      this.elements.wallpaperLayer.classList.add("hidden");
      this.elements.wallpaperLayer.style.backgroundImage = "none";
    }
  }

  evaluateNightMode() {
    const nm = this.settings.get("nightMode");
    const isAmbient = this.settings.get("ambientMode");
    let isNight = false;

    if (nm === "on" || isAmbient) {
      isNight = true;
    } else if (nm === "auto") {
      const h = new Date().getHours();
      if (h >= 22 || h < 7) {
        isNight = true;
      }
    }

    const dimFactor = isNight ? 0.35 : 1.0;
    document.documentElement.style.setProperty("--dim-factor", dimFactor);
  }

  onClockTick(now, info) {
    const formatted = ClockEngine.formatDigital(now, this.settings.settings);
    this.elements.hoursEl.textContent = formatted.hours;
    this.elements.minutesEl.textContent = formatted.minutes;
    this.elements.secondsEl.textContent = formatted.seconds;
    this.elements.ampmEl.textContent = formatted.ampm;

    if (formatted.ampm) {
      this.elements.ampmEl.style.display = "inline";
    } else {
      this.elements.ampmEl.style.display = "none";
    }

    if (formatted.showSeconds) {
      this.elements.secondsWrapper.style.display = "flex";
    } else {
      this.elements.secondsWrapper.style.display = "none";
    }

    if (info.dayChanged || this.elements.dateEl.textContent === "--" || info.secondChanged) {
      const dateFormatted = ClockEngine.formatDate(now, this.settings.settings);
      this.elements.weekdayEl.textContent = dateFormatted.weekday;
      this.elements.dateEl.textContent = dateFormatted.dateStr;
    }

    this.analogClock.update(now);

    if (this.settings.get("clockMode") === "dashboard") {
      this.renderWorldClocks(now);
    }
  }

  renderWeather(data) {
    if (!this.settings.get("showWeather") || !data) {
      this.elements.weatherContainer.style.display = "none";
      return;
    }
    this.elements.weatherContainer.style.display = "flex";
    this.elements.weatherIcon.innerHTML = data.icon || '<i class="fa-solid fa-sun text-amber-400"></i>';
    const tempStr = this.settings.get("language") === "kh" ? ClockEngine.toKhmerDigits(data.temp) : data.temp;
    this.elements.weatherTemp.textContent = `${tempStr}${data.unit}`;
    this.elements.weatherCond.textContent = `${data.condition} • ${data.location}`;
  }

  renderDevice(data) {
    if (this.settings.get("showBattery") && data.batterySupported) {
      this.elements.batteryContainer.style.display = "flex";
      const levelStr = this.settings.get("language") === "kh" ? ClockEngine.toKhmerDigits(data.batteryLevel) : data.batteryLevel;
      this.elements.batteryLevel.textContent = `${levelStr}%`;
      this.elements.batteryIcon.innerHTML = DeviceService.getBatteryIcon(data.batteryLevel, data.isCharging);
    } else {
      this.elements.batteryContainer.style.display = "none";
    }

    if (this.settings.get("showNetwork")) {
      this.elements.networkContainer.style.display = "flex";
      this.elements.networkStatusIcon.className = `mr-1 ${data.online ? "text-emerald-400" : "text-red-500"}`;
    } else {
      this.elements.networkContainer.style.display = "none";
    }

    if (this.settings.get("showTimezone")) {
      this.elements.timezoneEl.style.display = "block";
      this.elements.timezoneEl.textContent = `${data.timezone} (${data.gmtOffset})`;
    } else {
      this.elements.timezoneEl.style.display = "none";
    }
  }

  renderWorldClocks(now) {
    const list = this.worldClock.getClocks(now);
    const isKh = this.settings.get("language") === "kh";
    this.elements.worldList.innerHTML = list
      .map(
        (item) => `
      <div class="flex items-center justify-between space-x-3 text-zinc-300">
        <span class="font-medium text-zinc-400">${item.name}</span>
        <div class="flex items-center space-x-1.5 font-semibold tabular-nums">
          <span>${isKh ? ClockEngine.toKhmerDigits(item.time) : item.time}</span>
          ${item.dayDiff ? `<span class="text-[9px] text-amber-500 bg-amber-950/60 px-1 rounded">${item.dayDiff}</span>` : ""}
        </div>
      </div>
    `
      )
      .join("");
  }

  checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;
    if (isPortrait && !this.dismissedPortrait) {
      document.body.classList.add("is-portrait");
    } else {
      document.body.classList.remove("is-portrait");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.app = new SmartClockApp();
});
