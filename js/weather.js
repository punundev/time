class WeatherService {
  constructor(settingsManager) {
    this.settings = settingsManager;
    this.cacheKey = "smartClock.weatherCache";
    this.refreshIntervalMs = 20 * 60 * 1000;
    this.lastFetchTime = 0;
    this.data = this.loadCache();
    this.listeners = [];

    window.addEventListener("online", () => this.fetchWeather(true));
  }

  loadCache() {
    try {
      const raw = localStorage.getItem(this.cacheKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.lastFetchTime = parsed.timestamp || 0;
        return parsed.data || null;
      }
    } catch (e) {}
    return null;
  }

  saveCache(data) {
    try {
      this.data = data;
      this.lastFetchTime = Date.now();
      localStorage.setItem(this.cacheKey, JSON.stringify({
        timestamp: this.lastFetchTime,
        data: data
      }));
    } catch (e) {}
  }

  onUpdate(callback) {
    this.listeners.push(callback);
    if (this.data) {
      callback(this.data);
    }
  }

  notify() {
    this.listeners.forEach((fn) => fn(this.data));
  }

  async fetchWeather(force = false) {
    if (!this.settings.get("showWeather")) return;
    if (!navigator.onLine) {
      this.notify();
      return;
    }

    if (!force && Date.now() - this.lastFetchTime < this.refreshIntervalMs && this.data) {
      this.notify();
      return;
    }

    let lat = 13.3633;
    let lon = 103.8564;
    let locationName = "Siem Reap";

    if ("geolocation" in navigator) {
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
        locationName = "Local";
      } catch (e) {}
    }

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Weather fetch failed");
      const json = await res.json();

      const current = json.current_weather;
      const weatherCode = current.weathercode;
      const icon = this.getWeatherIcon(weatherCode);
      const condition = this.getWeatherCondition(weatherCode);

      const weatherData = {
        temp: Math.round(current.temperature),
        condition: condition,
        icon: icon,
        location: locationName,
        wind: current.windspeed,
        unit: "°C"
      };

      this.saveCache(weatherData);
      this.notify();
    } catch (err) {
      this.notify();
    }
  }

  getWeatherIcon(code) {
    if (code === 0) return '<i class="fa-solid fa-sun text-amber-400"></i>';
    if (code >= 1 && code <= 3) return '<i class="fa-solid fa-cloud-sun text-yellow-300"></i>';
    if (code >= 45 && code <= 48) return '<i class="fa-solid fa-smog text-gray-400"></i>';
    if (code >= 51 && code <= 67) return '<i class="fa-solid fa-cloud-rain text-blue-400"></i>';
    if (code >= 71 && code <= 77) return '<i class="fa-solid fa-snowflake text-cyan-200"></i>';
    if (code >= 80 && code <= 82) return '<i class="fa-solid fa-cloud-showers-heavy text-blue-300"></i>';
    if (code >= 95 && code <= 99) return '<i class="fa-solid fa-cloud-bolt text-yellow-500"></i>';
    return '<i class="fa-solid fa-temperature-half text-amber-500"></i>';
  }

  getWeatherCondition(code) {
    if (code === 0) return "Clear";
    if (code >= 1 && code <= 3) return "Partly Cloudy";
    if (code >= 45 && code <= 48) return "Foggy";
    if (code >= 51 && code <= 67) return "Rainy";
    if (code >= 71 && code <= 77) return "Snowy";
    if (code >= 80 && code <= 82) return "Showers";
    if (code >= 95 && code <= 99) return "Thunderstorm";
    return "Fair";
  }
}

window.WeatherService = WeatherService;
