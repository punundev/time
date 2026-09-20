class FullscreenManager {
  constructor() {
    this.element = document.documentElement;
    this.toastTimeout = null;

    document.addEventListener("fullscreenchange", () => this.onFullscreenChange());
    document.addEventListener("webkitfullscreenchange", () => this.onFullscreenChange());
  }

  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }

  isFullscreen() {
    return (
      document.body.classList.contains("is-fullscreen-mode") ||
      !!document.fullscreenElement ||
      !!document.webkitFullscreenElement
    );
  }

  onFullscreenChange() {
    if (this.isFullscreen()) {
      document.body.classList.add("is-fullscreen-mode");
    } else {
      document.body.classList.remove("is-fullscreen-mode");
    }
  }

  toggle() {
    if (this.isFullscreen()) {
      this.exit();
    } else {
      this.request();
    }
  }

  request() {
    document.body.classList.add("is-fullscreen-mode");
    window.scrollTo(0, 1);

    const req =
      this.element.requestFullscreen ||
      this.element.webkitRequestFullscreen ||
      this.element.mozRequestFullScreen ||
      this.element.msRequestFullscreen;

    if (req && !this.isIOS()) {
      req.call(this.element).catch(() => {
        this.showIOSToast();
      });
    } else if (this.isIOS()) {
      this.showIOSToast();
    }
  }

  exit() {
    document.body.classList.remove("is-fullscreen-mode");

    const exit =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen;

    if (exit && (document.fullscreenElement || document.webkitFullscreenElement)) {
      exit.call(document).catch(() => {});
    }
  }

  showIOSToast() {
    const toast = document.getElementById("fullscreenToast");
    if (!toast) return;
    toast.classList.remove("hidden");
    toast.classList.add("flex");

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.add("hidden");
      toast.classList.remove("flex");
    }, 4500);
  }
}

window.fullscreenManager = new FullscreenManager();
