class FullscreenManager {
  constructor() {
    this.element = document.documentElement;
  }

  isSupported() {
    return !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );
  }

  isFullscreen() {
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
    if (!this.isSupported()) return;
    const req =
      this.element.requestFullscreen ||
      this.element.webkitRequestFullscreen ||
      this.element.mozRequestFullScreen ||
      this.element.msRequestFullscreen;

    if (req) {
      req.call(this.element).catch(() => {});
    }
  }

  exit() {
    if (!this.isFullscreen()) return;
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
