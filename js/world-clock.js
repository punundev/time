class WorldClockService {
  constructor(settingsManager) {
    this.settings = settingsManager;
  }

  getClocks(now) {
    const list = this.settings.get("worldClocks") || [];
    const is12h = this.settings.get("timeFormat") === "12h";
    const localDay = now.getDate();

    return list.map((tz) => {
      let timeStr = "";
      let dayDiff = "";
      let cityName = tz.split("/")[1] || tz;
      cityName = cityName.replace(/_/g, " ");

      try {
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: tz,
          hour: "numeric",
          minute: "2-digit",
          hour12: is12h
        });
        timeStr = formatter.format(now);

        const dayFormatter = new Intl.DateTimeFormat("en-US", {
          timeZone: tz,
          day: "numeric"
        });
        const targetDay = parseInt(dayFormatter.format(now), 10);

        if (targetDay > localDay || (targetDay === 1 && localDay > 27)) {
          dayDiff = "Tomorrow";
        } else if (targetDay < localDay || (localDay === 1 && targetDay > 27)) {
          dayDiff = "Yesterday";
        }
      } catch (e) {
        timeStr = "--:--";
      }

      return {
        timezone: tz,
        name: cityName,
        time: timeStr,
        dayDiff: dayDiff
      };
    });
  }

  addCity(timezone) {
    const list = [...(this.settings.get("worldClocks") || [])];
    if (!list.includes(timezone)) {
      list.push(timezone);
      this.settings.set("worldClocks", list);
    }
  }

  removeCity(timezone) {
    let list = [...(this.settings.get("worldClocks") || [])];
    list = list.filter((t) => t !== timezone);
    this.settings.set("worldClocks", list);
  }
}

window.WorldClockService = WorldClockService;
