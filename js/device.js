class DeviceService {
  constructor(settingsManager) {
    this.settings = settingsManager;
    this.battery = null;
    this.listeners = [];

    this.initNetwork();
    this.initBattery();
  }

  onUpdate(callback) {
    this.listeners.push(callback);
    this.notify();
  }

  notify() {
    const data = this.getSnapshot();
    this.listeners.forEach((fn) => fn(data));
  }

  getSnapshot() {
    const isOnline = navigator.onLine;
    let batteryLevel = null;
    let isCharging = false;

    if (this.battery) {
      batteryLevel = Math.round(this.battery.level * 100);
      isCharging = this.battery.charging;
    }

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local";
    const offset = -new Date().getTimezoneOffset() / 60;
    const gmtOffset = `GMT${offset >= 0 ? "+" : ""}${offset}`;

    return {
      online: isOnline,
      batterySupported: !!this.battery,
      batteryLevel: batteryLevel,
      isCharging: isCharging,
      timezone: timezone,
      gmtOffset: gmtOffset
    };
  }

  initNetwork() {
    window.addEventListener("online", () => this.notify());
    window.addEventListener("offline", () => this.notify());
  }

  async initBattery() {
    if ("getBattery" in navigator) {
      try {
        this.battery = await navigator.getBattery();
        this.battery.addEventListener("levelchange", () => this.notify());
        this.battery.addEventListener("chargingchange", () => this.notify());
        this.notify();
      } catch (e) {}
    }
  }

  static getBatteryIcon(level, isCharging) {
    if (isCharging) return '<i class="fa-solid fa-bolt text-yellow-400"></i>';
    if (level === null) return '<i class="fa-solid fa-battery-full text-zinc-300"></i>';
    if (level > 75) return '<i class="fa-solid fa-battery-full text-emerald-400"></i>';
    if (level > 40) return '<i class="fa-solid fa-battery-three-quarters text-emerald-300"></i>';
    if (level > 20) return '<i class="fa-solid fa-battery-half text-amber-400"></i>';
    return '<i class="fa-solid fa-battery-quarter text-red-500"></i>';
  }
}

window.DeviceService = DeviceService;
