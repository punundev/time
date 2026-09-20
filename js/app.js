class SmartClockApp {
  constructor() {
    this.settings = window.settingsManager;
    this.clockEngine = new ClockEngine(this.settings);
    this.weatherService = new WeatherService(this.settings);
    this.deviceService = new DeviceService(this.settings);
    this.wakeLock = new WakeLockManager(this.settings);
    this.worldClock = new WorldClockService(this.settings);

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
      networkStatus: document.getElementById("networkStatus"),
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
      portraitWarning: document.getElementById("portraitWarning")
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
    bindCheck("settingShowWeather", "showWeather");
    bindCheck("settingShowBattery", "showBattery");
    bindCheck("settingShowNetwork", "showNetwork");
    bindCheck("settingShowTimezone", "showTimezone");
    bindSelect("settingNightMode", "nightMode");
    bindCheck("settingWakeLock", "wakeLock");
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
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = endX - this.touchStartX;
    const diffY = endY - this.touchStartY;

    if (Math.abs(diffY) > 60 && Math.abs(diffY) > Math.abs(diffX)) {
      if (diffY < 0) {
        this.openSettings();
      } else {
        this.closeSettings();
      }
    } else if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY)) {
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

    if (info.dayChanged || this.elements.dateEl.textContent === "--") {
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
    this.elements.weatherIcon.textContent = data.icon || "☀️";
    this.elements.weatherTemp.textContent = `${data.temp}${data.unit}`;
    this.elements.weatherCond.textContent = `${data.condition} • ${data.location}`;
  }

  renderDevice(data) {
    if (this.settings.get("showBattery") && data.batterySupported) {
      this.elements.batteryContainer.style.display = "flex";
      this.elements.batteryLevel.textContent = `${data.batteryLevel}%`;
      this.elements.batteryIcon.textContent = data.isCharging ? "⚡" : "🔋";
    } else {
      this.elements.batteryContainer.style.display = "none";
    }

    if (this.settings.get("showNetwork")) {
      this.elements.networkContainer.style.display = "flex";
      this.elements.networkStatus.className = `w-2 h-2 rounded-full ${data.online ? "bg-emerald-500" : "bg-red-500"}`;
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
    this.elements.worldList.innerHTML = list
      .map(
        (item) => `
      <div class="flex items-center justify-between space-x-3 text-zinc-300">
        <span class="font-medium text-zinc-400">${item.name}</span>
        <div class="flex items-center space-x-1.5 font-semibold tabular-nums">
          <span>${item.time}</span>
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
