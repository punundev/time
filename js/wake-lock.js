class WakeLockManager {
  constructor(settingsManager) {
    this.settings = settingsManager;
    this.wakeLock = null;
    this.enabled = false;

    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    document.addEventListener("visibilitychange", this.onVisibilityChange);
  }

  isSupported() {
    return "wakeLock" in navigator;
  }

  async request() {
    if (!this.isSupported() || !this.settings.get("wakeLock")) return;
    try {
      this.wakeLock = await navigator.wakeLock.request("screen");
      this.enabled = true;

      this.wakeLock.addEventListener("release", () => {
        this.enabled = false;
        this.wakeLock = null;
      });
    } catch (err) {
      this.enabled = false;
      this.wakeLock = null;
    }
  }

  async release() {
    if (this.wakeLock) {
      try {
        await this.wakeLock.release();
      } catch (err) {}
      this.wakeLock = null;
      this.enabled = false;
    }
  }

  onVisibilityChange() {
    if (document.visibilityState === "visible" && this.settings.get("wakeLock")) {
      this.request();
    }
  }
}

window.WakeLockManager = WakeLockManager;
