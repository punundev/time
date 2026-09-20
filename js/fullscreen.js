class FullscreenManager {
  constructor() {
    this.element = document.documentElement;
  }

  isSupported() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (isIOS) return false;
    return !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );
  }

  isFullscreen() {
    if (document.body.classList.contains("ios-fullscreen")) {
      return true;
    }
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  }

  toggle() {
    if (this.isFullscreen()) {
      this.exit();
    } else {
      this.request();
    }
  }

  request() {
    if (!this.isSupported()) {
      document.body.classList.add("ios-fullscreen");
      window.scrollTo(0, 1);
      return;
    }
    const req =
      this.element.requestFullscreen ||
      this.element.webkitRequestFullscreen ||
      this.element.mozRequestFullScreen ||
      this.element.msRequestFullscreen;

    if (req) {
      req.call(this.element).catch(() => {
        document.body.classList.add("ios-fullscreen");
        window.scrollTo(0, 1);
      });
    }
  }

  exit() {
    if (document.body.classList.contains("ios-fullscreen")) {
      document.body.classList.remove("ios-fullscreen");
    }
    if (!this.isSupported()) return;
    const exit =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen;

    if (exit) {
      exit.call(document).catch(() => {});
    }
  }
}

window.fullscreenManager = new FullscreenManager();
