class AnalogClock {
  constructor(containerElement, settingsManager) {
    this.container = containerElement;
    this.settings = settingsManager;
    this.svg = null;
    this.hourHand = null;
    this.minuteHand = null;
    this.secondHand = null;
    this.markersGroup = null;
    this.numbersGroup = null;

    this.init();
  }

  init() {
    this.container.innerHTML = `
      <svg viewBox="0 0 200 200" class="w-full h-full max-w-[200px] max-h-[200px] mx-auto select-none">
        <circle cx="100" cy="100" r="96" fill="rgba(0,0,0,0.2)" stroke="var(--border-color)" stroke-width="2"/>
        <g id="analogMarkers"></g>
        <g id="analogNumbers"></g>
        <line id="hourHand" x1="100" y1="100" x2="100" y2="55" stroke="var(--text-primary)" stroke-width="4" stroke-linecap="round"/>
        <line id="minuteHand" x1="100" y1="100" x2="100" y2="35" stroke="var(--text-primary)" stroke-width="3" stroke-linecap="round"/>
        <line id="secondHand" x1="100" y1="105" x2="100" y2="25" stroke="var(--accent-color)" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="100" cy="100" r="4" fill="var(--accent-color)"/>
      </svg>
    `;

    this.svg = this.container.querySelector("svg");
    this.markersGroup = this.container.querySelector("#analogMarkers");
    this.numbersGroup = this.container.querySelector("#analogNumbers");
    this.hourHand = this.container.querySelector("#hourHand");
    this.minuteHand = this.container.querySelector("#minuteHand");
    this.secondHand = this.container.querySelector("#secondHand");

    this.renderDialStyle();
  }

  renderDialStyle() {
    const style = this.settings.get("analogStyle") || "minimal";
    this.markersGroup.innerHTML = "";
    this.numbersGroup.innerHTML = "";

    const showNumbers = style === "classic" || style === "full";
    const fullNumbers = style === "full";

    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 * Math.PI) / 180;
      const x1 = 100 + 84 * Math.sin(angle);
      const y1 = 100 - 84 * Math.cos(angle);
      const x2 = 100 + 92 * Math.sin(angle);
      const y2 = 100 - 92 * Math.cos(angle);

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2);
      line.setAttribute("stroke", "var(--text-muted)");
      line.setAttribute("stroke-width", i % 3 === 0 ? "2.5" : "1");
      this.markersGroup.appendChild(line);

      if (showNumbers) {
        const hourNum = i === 0 ? 12 : i;
        if (fullNumbers || [12, 3, 6, 9].includes(hourNum)) {
          const nx = 100 + 70 * Math.sin(angle);
          const ny = 100 - 70 * Math.cos(angle) + 4;
          const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
          text.setAttribute("x", nx);
          text.setAttribute("y", ny);
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("fill", "var(--text-primary)");
          text.setAttribute("font-size", "12");
          text.setAttribute("font-weight", "600");
          text.textContent = hourNum;
          this.numbersGroup.appendChild(text);
        }
      }
    }
  }

  update(now) {
    const showSeconds = this.settings.get("showSeconds");
    this.secondHand.style.display = showSeconds ? "block" : "none";

    const ms = now.getMilliseconds();
    const sec = now.getSeconds() + (showSeconds ? ms / 1000 : 0);
    const min = now.getMinutes() + sec / 60;
    const hour = (now.getHours() % 12) + min / 60;

    const secAngle = sec * 6;
    const minAngle = min * 6;
    const hourAngle = hour * 30;

    this.hourHand.setAttribute("transform", `rotate(${hourAngle} 100 100)`);
    this.minuteHand.setAttribute("transform", `rotate(${minAngle} 100 100)`);
    if (showSeconds) {
      this.secondHand.setAttribute("transform", `rotate(${secAngle} 100 100)`);
    }
  }
}

window.AnalogClock = AnalogClock;
