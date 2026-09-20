# ROLE

Act as a senior **HTML5, Tailwind CSS, Vanilla JavaScript, UI/UX, responsive-design, and digital/analog clock engineer**.

Build a polished, production-quality **Smart Clock Website** specifically optimized for an **iPhone 7 in landscape orientation (4.7-inch display, 1334×750 physical resolution)**.

The website should feel like a **native lightweight smart-clock application**, not like a normal website.

The primary goal is:

> Turn an old iPhone 7 into a beautiful always-visible landscape desk/night clock with digital time, analog time, date, weather, useful information, and configurable clock features.

Do NOT use React, Vue, Next.js, Angular, Bootstrap, jQuery, or other frameworks.

Use only:

- HTML5
- Tailwind CSS
- Vanilla JavaScript
- CSS where necessary
- Browser APIs where appropriate
- LocalStorage for settings

The application must be extremely lightweight and efficient because it will run for long periods on an old iPhone 7.

---

# 1. CORE DESIGN TARGET

The primary target device is:

**iPhone 7**

Screen:

- 4.7-inch
- Landscape
- 1334 × 750 physical pixels
- CSS viewport will typically be approximately 667 × 375 logical pixels
- Retina display
- Safari/WebKit

Design primarily for:

```text
Landscape
667 × 375 CSS pixels
```

Do NOT design desktop-first and simply shrink it.

Design the interface specifically around the small landscape viewport.

The clock must remain usable at:

- 568 × 320
- 667 × 375
- 736 × 414
- modern small landscape phones
- desktop browser for development/testing

The **667×375 landscape layout is the most important target**.

---

# 2. OVERALL EXPERIENCE

The website should look like a premium minimalist smart clock.

Think:

- Apple-inspired simplicity
- premium digital clock
- modern dashboard
- minimal visual noise
- large readable time
- smooth animations
- excellent spacing
- dark-room friendly
- information available at a glance

Avoid:

- clutter
- excessive cards
- huge navigation bars
- desktop-style dashboards
- unnecessary buttons
- heavy gradients
- excessive animations
- giant shadows
- complicated UI

The clock should feel like:

> "A dedicated clock device."

Not:

> "A website with a clock on it."

---

# 3. FULLSCREEN EXPERIENCE

The application should occupy the entire viewport.

Use:

```css
width: 100vw;
height: 100dvh;
```

with fallbacks where necessary.

Handle:

```css
env(safe-area-inset-top)
env(safe-area-inset-bottom)
env(safe-area-inset-left)
env(safe-area-inset-right)
```

The application should work correctly with:

- iPhone Safari
- landscape orientation
- browser fullscreen
- standalone/PWA-like environment if installed
- Safari address-bar changes

Prevent accidental horizontal scrolling.

Prevent unnecessary page scrolling.

The main clock screen should always fit within the viewport.

---

# 4. MAIN SCREEN LAYOUT

Create a primary clock dashboard.

The layout should contain:

```text
┌──────────────────────────────────────────────────────┐
│ Date                         Weather / Location       │
│                                                      │
│                                                      │
│              10:42:36                                │
│                                                      │
│          Wednesday, September 20                     │
│                                                      │
│      Analog Clock      │      Information            │
│                                                      │
│                     Controls                         │
└──────────────────────────────────────────────────────┘
```

However, make the actual design much more polished.

The **time must dominate the screen**.

---

# 5. DIGITAL CLOCK

Create a large digital clock.

Example:

```text
10:42:36
```

Support:

### 24-hour mode

```text
22:42:36
```

### 12-hour mode

```text
10:42:36 PM
```

Features:

- hours
- minutes
- seconds
- optional seconds
- optional AM/PM
- smooth updates
- no visible layout jumping
- tabular/monospaced numerals if appropriate

Use a font stack optimized for readability.

Prefer:

```css
font-variant-numeric: tabular-nums;
```

The digits should remain perfectly aligned as seconds change.

---

# 6. CLOCK UPDATE ENGINE

Do NOT simply rely on:

```javascript
setInterval(..., 1000)
```

for all timing logic.

Build a robust clock engine using:

```javascript
Date.now();
requestAnimationFrame();
```

or a hybrid approach.

The clock should remain synchronized with the actual system time.

Requirements:

- accurate seconds
- no cumulative drift
- recover correctly after tab/background suspension
- update immediately when returning to foreground
- handle system clock changes
- handle timezone changes
- handle daylight-saving changes where applicable

Use one centralized clock state.

Example architecture:

```javascript
ClockEngine
    ↓
TimeState
    ↓
DigitalClock
AnalogClock
DateDisplay
WorldClock
```

Do not create separate timers for every component.

Use one shared time source.

---

# 7. SECONDS DISPLAY

Add a setting:

```text
Show seconds
```

Options:

```text
ON
OFF
```

When disabled:

```text
10:42
```

When enabled:

```text
10:42:36
```

The layout must smoothly adapt without breaking.

---

# 8. DIGITAL CLOCK STYLES

Create multiple clock styles.

At minimum:

### Style 1 — Minimal

Large clean digits.

### Style 2 — Modern

Large digits with subtle spacing.

### Style 3 — Thin

Thin elegant typography.

### Style 4 — Bold

Strong high-contrast typography.

### Style 5 — Matrix / Tech

Subtle futuristic digital style.

Allow users to switch styles from settings.

Do not load large external font libraries unless absolutely necessary.

Prefer system fonts for performance.

---

# 9. ANALOG CLOCK

Create a beautiful analog clock using **HTML/CSS/SVG or Canvas**.

Do NOT use an external clock library.

The analog clock must include:

- hour hand
- minute hand
- second hand
- center pin
- 12 hour markers
- optional minute markers
- optional numbers
- smooth second hand
- accurate positioning

Example:

```text
        12
     11    1

  10          2

9      ●        3

  8           4

     7     5
        6
```

The hands must accurately represent:

```text
seconds
minutes + seconds
hours + minutes
```

Do not jump the hour hand every hour.

It should move continuously.

---

# 10. ANALOG CLOCK THEMES

Provide several themes:

### Minimal

No numbers, simple markers.

### Classic

12, 3, 6, 9 numbers.

### Full

All 12 numbers.

### Modern

Minimal markers and thin hands.

### Dark

Designed for nighttime.

The analog clock should automatically scale according to available screen space.

---

# 11. DATE

Show:

```text
Saturday, September 20
```

Optionally:

```text
Saturday, September 20, 2026
```

Allow date format selection.

Possible formats:

```text
Saturday, September 20
20 September 2026
Sep 20, 2026
20/09/2026
20-09-2026
```

Use the user's browser locale where appropriate.

---

# 12. DAY OF WEEK

The day should be visually clear.

Example:

```text
SATURDAY
September 20, 2026
```

Allow:

- uppercase
- title case
- lowercase

---

# 13. WEATHER AREA

Create a compact weather information section.

Example:

```text
☀️ 29°C
Clear
Siem Reap
```

Information:

- temperature
- weather condition
- location
- optional humidity
- optional wind
- optional feels-like temperature

Design it so the clock still works if weather data is unavailable.

If no API is configured, display:

```text
Weather unavailable
```

Do not break the interface.

Create a clean weather-service abstraction:

```javascript
WeatherService;
```

so an API can be added later.

Do not hardcode an API key.

Use configuration such as:

```javascript
const WEATHER_CONFIG = {
  enabled: false,
  apiKey: "",
  latitude: null,
  longitude: null,
};
```

---

# 14. WORLD CLOCK

Add an optional world-clock panel.

Allow multiple locations such as:

```text
Phnom Penh
Bangkok
Tokyo
Singapore
London
New York
Los Angeles
```

Each should show:

```text
Tokyo
10:42 PM
```

Use the JavaScript:

```javascript
Intl.DateTimeFormat;
```

with IANA timezone names.

Examples:

```text
Asia/Phnom_Penh
Asia/Bangkok
Asia/Tokyo
Asia/Singapore
Europe/London
America/New_York
America/Los_Angeles
```

Do not manually calculate timezone offsets.

---

# 15. TIMEZONE

Add a timezone indicator.

Example:

```text
GMT+7
```

or:

```text
Asia/Phnom_Penh
```

Allow it to be hidden.

The main clock should normally use the device's local timezone.

---

# 16. BATTERY INFORMATION

If browser APIs permit it, display:

```text
🔋 82%
```

Use the Battery Status API only when available.

If unsupported:

- hide the battery widget
- do not show an error

Never continuously poll battery state.

Listen for battery events when available.

---

# 17. DEVICE INFORMATION

Create an optional information panel showing:

```text
Battery
Network
Screen orientation
Current timezone
```

Example:

```text
82%     Wi-Fi
Landscape
GMT+7
```

Keep this compact.

---

# 18. NETWORK STATUS

Display:

```text
Online
```

or:

```text
Offline
```

Use:

```javascript
navigator.onLine;
```

and:

```javascript
online;
offline;
```

events.

Do not repeatedly poll the network.

---

# 19. FULLSCREEN MODE

Add fullscreen functionality.

Button:

```text
Fullscreen
```

Use:

```javascript
document.documentElement.requestFullscreen();
```

when supported.

Handle Safari limitations gracefully.

If fullscreen is unavailable, do not show an ugly error.

---

# 20. WAKE / SCREEN BEHAVIOR

The application should attempt to keep the display active while the clock is being used.

Use the Screen Wake Lock API when available:

```javascript
navigator.wakeLock.request("screen");
```

Create:

```javascript
WakeLockManager;
```

Requirements:

- request wake lock when appropriate
- release it when leaving clock mode
- reacquire it after visibility changes when allowed
- handle unsupported browsers gracefully
- never crash if wake lock is denied

Important:

The website cannot magically detect a person approaching the phone unless the browser/device provides an appropriate sensor or camera permission/API.

Do NOT pretend proximity detection is available if it is not.

Create the architecture so a future sensor/proximity feature could be added.

---

# 21. AUTO DIM / NIGHT MODE

Create an automatic night mode.

Allow settings:

```text
Night Mode
OFF
ON
AUTO
```

AUTO mode example:

```text
22:00 → 07:00
```

During night mode:

- reduce brightness
- reduce contrast
- reduce animation
- use darker background
- reduce seconds visibility if configured

Example:

```text
Normal brightness: 100%
Night brightness: 20%
```

Use CSS variables for brightness-related effects.

Do not actually change the iPhone's system brightness.

Only visually dim the web application.

---

# 22. AMBIENT MODE

Add an optional ultra-minimal mode.

When enabled, display only:

```text
10:42
```

with very dim styling.

Optional:

```text
10:42
SATURDAY
```

Everything else disappears.

This mode should be excellent for bedside/nightstand use.

---

# 23. SETTINGS PANEL

Create a settings drawer/modal.

It should not permanently consume screen space.

Open using a small gear button.

Settings categories:

### Clock

- 12/24 hour
- show seconds
- digital style
- font size
- clock alignment

### Analog

- show analog clock
- analog style
- numbers
- minute markers
- second hand

### Appearance

- theme
- accent color
- brightness
- night mode
- ambient mode

### Information

- show date
- show weather
- show battery
- show network
- show timezone
- show world clocks

### Behavior

- fullscreen
- wake lock
- auto night mode
- screen interaction behavior

### World Clock

- add city
- remove city
- reorder cities

---

# 24. THEMES

Create at least these themes:

### Midnight

Very dark black/gray.

### Graphite

Dark gray.

### OLED Black

Pure/near-pure black.

### Arctic

Light clean theme.

### Aurora

Dark with subtle colored accent.

### Minimal White

Bright white with black text.

Use CSS variables.

Example:

```css
:root {
  --background: #050505;
  --foreground: #ffffff;
  --muted: #888888;
  --accent: #ffffff;
}
```

Do not duplicate entire styles for each theme.

Switch variables.

---

# 25. ACCENT COLORS

Allow configurable accent:

- White
- Blue
- Cyan
- Green
- Purple
- Orange

Keep colors subtle.

The clock itself should remain the visual focus.

---

# 26. RESPONSIVE DESIGN

This is extremely important.

Design specifically for:

```text
667 × 375
```

but support smaller screens.

Use:

```css
clamp()
```

for responsive typography.

Example:

```css
font-size: clamp(3rem, 12vw, 8rem);
```

Do NOT hardcode:

```css
font-size: 100px;
```

without responsive logic.

The main clock must never overflow.

---

# 27. LANDSCAPE PRIORITY

Landscape is the primary orientation.

If the device is portrait, display a clean message:

```text
Rotate your iPhone
For the best clock experience
```

Optionally support portrait as a fallback.

Do not allow the landscape layout to become broken when rotated.

Detect:

```javascript
window.matchMedia("(orientation: landscape)");
```

---

# 28. TOUCH UX

Optimize for fingers.

Buttons should generally have a minimum touch target around:

```text
44 × 44 px
```

even though the visual icon can be smaller.

Avoid tiny controls.

Do not require hover.

The interface must work perfectly using touch.

Add:

```css
-webkit-tap-highlight-color: transparent;
```

where appropriate.

Use:

```css
touch-action: manipulation;
```

where appropriate.

---

# 29. HIDDEN CONTROLS

The clock should look clean when idle.

Controls can fade out after inactivity.

Example:

```text
User touches screen
       ↓
Controls appear
       ↓
5 seconds without interaction
       ↓
Controls fade away
```

Do not remove functionality.

Controls should reappear immediately after touch.

---

# 30. GESTURES

Support simple gestures if useful.

Example:

### Tap

Show controls.

### Double tap

Toggle ambient mode.

### Swipe left/right

Switch clock layout.

### Swipe up

Open settings.

### Swipe down

Close settings.

Do not implement gestures if they interfere with normal scrolling/touch behavior.

Keep gesture handling simple and reliable.

---

# 31. CLOCK MODES

Provide several main layouts.

### Mode A — Digital

Large digital clock + date + weather.

### Mode B — Analog

Large analog clock + date.

### Mode C — Hybrid

Digital clock + small analog clock.

### Mode D — Dashboard

Digital clock + analog + weather + world clock.

### Mode E — Ambient

Ultra-minimal time.

Allow switching between modes.

---

# 32. INFORMATION PRIORITY

At 667×375, prioritize:

1. Time
2. Date/day
3. Weather
4. Analog clock
5. Battery
6. Network
7. World clocks

Do not allow secondary information to visually compete with the main time.

---

# 33. ANIMATION

Animations should be subtle.

Use:

- fade
- opacity
- transform
- gentle transitions

Avoid:

- bouncing
- excessive scaling
- flashing
- continuous decorative animation

The clock itself must remain stable.

The second hand can animate smoothly.

Respect:

```css
@media (prefers-reduced-motion: reduce);
```

When reduced motion is enabled:

- disable decorative animations
- reduce transitions
- use simple second updates

---

# 34. PERFORMANCE

This is a critical requirement.

The application will potentially run for hours.

Avoid:

- React
- large libraries
- heavy dependencies
- unnecessary intervals
- unnecessary DOM updates
- excessive re-rendering
- large images
- video backgrounds
- WebGL
- continuous expensive calculations

Use:

```javascript
requestAnimationFrame();
```

only where necessary.

Do not update the entire DOM every frame.

Update only elements whose values changed.

For example:

```javascript
hoursElement.textContent = ...
minutesElement.textContent = ...
secondsElement.textContent = ...
```

Do not rebuild the entire clock DOM every second.

---

# 35. MEMORY LEAK PREVENTION

Make sure:

- event listeners are not repeatedly registered
- timers are cleaned up
- animation frames are cancelled when necessary
- modal listeners are not duplicated
- wake lock handlers are managed correctly
- visibility handlers are registered once

Create clean lifecycle functions.

---

# 36. LOCAL STORAGE

Persist all user preferences.

Use:

```javascript
localStorage;
```

Store:

```text
clock mode
12/24 hour
seconds
theme
accent
digital style
analog style
date format
weather enabled
battery enabled
network enabled
timezone
night mode
ambient mode
world clocks
```

Use one namespaced key:

```text
smartClock.settings
```

Create:

```javascript
SettingsManager;
```

with methods:

```javascript
load();
save();
reset();
update();
```

Validate stored settings.

If localStorage contains invalid data, gracefully fall back to defaults.

---

# 37. DEFAULT SETTINGS

Use sensible defaults:

```javascript
{
    clockMode: "hybrid",
    timeFormat: "24h",
    showSeconds: true,
    showDate: true,
    showWeather: true,
    showBattery: true,
    showNetwork: true,
    showTimezone: false,
    theme: "midnight",
    accent: "white",
    digitalStyle: "modern",
    analogStyle: "minimal",
    nightMode: "auto",
    ambientMode: false,
    wakeLock: true,
    fullscreen: false
}
```

---

# 38. KEYBOARD SUPPORT

Even though the main device is an iPhone, make the desktop development version keyboard accessible.

Suggested shortcuts:

```text
F       Toggle fullscreen
S       Toggle seconds
A       Toggle analog
D       Toggle digital
N       Toggle night mode
M       Toggle ambient mode
Esc     Close settings
Space   Show/hide controls
```

Do not trigger shortcuts while the user is typing in an input.

---

# 39. ACCESSIBILITY

Use semantic HTML.

Examples:

```html
<main>
  <section>
    <button>
      <dialog></dialog>
    </button>
  </section>
</main>
```

Buttons must have:

```text
aria-label
```

when only an icon is visible.

Example:

```html
<button aria-label="Open settings"></button>
```

Ensure adequate contrast.

Support keyboard navigation.

Respect:

```text
prefers-reduced-motion
```

Do not rely solely on color to communicate state.

---

# 40. SAFARI / IOS COMPATIBILITY

Pay special attention to iOS Safari.

Use:

```css
-webkit-font-smoothing: antialiased;
-webkit-touch-callout: none;
-webkit-user-select: none;
```

where appropriate.

Handle:

```text
100dvh
100svh
100lvh
```

appropriately.

Do not assume every modern browser API exists.

Feature-detect:

```javascript
if ("wakeLock" in navigator)
```

and similar APIs.

Never let unsupported APIs crash the application.

---

# 41. PWA-READY STRUCTURE

Make the project easy to convert into a PWA.

Create:

```text
index.html
manifest.webmanifest
sw.js
```

If service-worker functionality is implemented, keep it simple.

The application should be capable of running offline for the clock itself.

Weather may naturally require network access.

The clock, date, settings, themes, and analog clock must work without internet.

---

# 42. FILE STRUCTURE

Use a clean structure:

```text
smart-clock/
│
├── index.html
├── manifest.webmanifest
├── sw.js
│
├── css/
│   └── styles.css
│
├── js/
│   ├── app.js
│   ├── clock.js
│   ├── analog-clock.js
│   ├── settings.js
│   ├── weather.js
│   ├── device.js
│   ├── fullscreen.js
│   ├── wake-lock.js
│   └── world-clock.js
│
└── assets/
    └── icons/
```

If Tailwind is used through CDN for simplicity, keep custom CSS minimal.

If you choose a build-based Tailwind setup, explain the setup clearly.

For the simplest iPhone deployment, prefer a lightweight setup.

---

# 43. TAILWIND CSS

Use Tailwind utilities wherever practical.

Do not create unnecessarily huge custom CSS.

However, use custom CSS for things Tailwind is not ideal for:

- analog clock hands
- CSS variables
- safe-area handling
- iOS viewport handling
- clock-specific animations
- theme variables

Keep the design clean and maintainable.

---

# 44. ICONS

Avoid loading a huge icon library.

Prefer:

- inline SVG
- small custom SVG icons
- CSS where possible

Create simple icons for:

- settings
- fullscreen
- battery
- wifi
- weather
- clock
- moon
- brightness
- world clock

Keep SVGs lightweight.

---

# 45. SETTINGS UX

Settings should appear as a polished overlay.

On iPhone landscape:

```text
┌────────────────────────────────────────────┐
│ Settings                              ×    │
├────────────────────────────────────────────┤
│ Clock                                      │
│ 24-hour                 [ ON ]             │
│ Seconds                  [ ON ]             │
│                                            │
│ Appearance                                 │
│ Theme                   Midnight            │
│                                            │
│ Information                               │
│ Weather                 [ ON ]             │
│ Battery                 [ ON ]             │
│                                            │
│                  Reset Settings            │
└────────────────────────────────────────────┘
```

Use a scrollable settings area only inside the settings panel.

The main clock itself should never scroll.

---

# 46. RESET SETTINGS

Add:

```text
Reset Settings
```

Ask for confirmation.

After reset:

- restore defaults
- refresh UI
- save defaults to localStorage

---

# 47. ERROR HANDLING

Never let one feature break the entire application.

For example:

Weather fails:

```text
Clock continues working.
```

Battery API unavailable:

```text
Battery widget disappears.
```

Wake Lock unavailable:

```text
Clock continues normally.
```

Fullscreen unavailable:

```text
Clock continues normally.
```

World clock invalid:

```text
Ignore invalid timezone.
```

Use graceful degradation everywhere.

---

# 48. DEBUG MODE

Create a simple development/debug mode.

Allow:

```javascript
DEBUG = false;
```

When true, optionally show:

```text
Clock engine
FPS
Wake Lock
Fullscreen
Network
Battery API
Screen size
Orientation
```

Do not show debug information in production mode.

---

# 49. CODE QUALITY

Write production-quality code.

Requirements:

- modular JavaScript
- clear function names
- comments for non-obvious logic
- no duplicated logic
- no global pollution
- avoid unnecessary classes when simple modules/functions are better
- use constants
- use semantic names
- handle null elements safely
- validate settings

Avoid giant 2,000-line JavaScript files.

---

# 50. CLOCK ENGINE ARCHITECTURE

Use an architecture similar to:

```text
App
│
├── ClockEngine
│   └── TimeState
│
├── DigitalClock
│
├── AnalogClock
│
├── DateDisplay
│
├── WeatherService
│
├── DeviceService
│
├── WorldClock
│
├── SettingsManager
│
├── WakeLockManager
│
├── FullscreenManager
│
└── UIController
```

The important principle:

**One source of truth for time.**

All clock components receive the same current time.

---

# 51. ANALOG CLOCK IMPLEMENTATION

Prefer SVG for the analog clock.

Example architecture:

```html
<svg viewBox="0 0 200 200">
  <circle />
  <g id="markers"></g>
  <g id="numbers"></g>
  <line id="hourHand" />
  <line id="minuteHand" />
  <line id="secondHand" />
  <circle />
</svg>
```

Calculate:

```text
secondAngle = seconds × 6

minuteAngle = minutes × 6 + seconds × 0.1

hourAngle = (hours % 12) × 30 + minutes × 0.5
```

For smooth movement, account for milliseconds.

---

# 52. DIGITAL CLOCK ACCURACY

Use:

```javascript
const now = new Date();
```

for the actual displayed time.

Never increment:

```javascript
seconds++;
```

as the authoritative time.

Always derive displayed time from the actual current timestamp.

This prevents drift.

---

# 53. DATE CHANGE

The application must correctly handle:

```text
23:59:59
↓
00:00:00
```

and immediately update:

- date
- weekday
- weather refresh timing if appropriate
- world clocks

Do not require a page reload.

---

# 54. WORLD CLOCK DATE

World clocks must correctly show when another location is on a different date.

Example:

```text
Tokyo
Monday
00:30
```

while the local clock may still show:

```text
Sunday
23:30
```

Use `Intl.DateTimeFormat`.

---

# 55. WEATHER REFRESH

Do not request weather every second.

If weather API integration is implemented, refresh approximately every:

```text
10–30 minutes
```

and when:

- application starts
- user manually refreshes
- network returns online

Cache the last successful weather result.

---

# 56. USER EXPERIENCE ON FIRST LOAD

On first load:

1. Detect viewport.
2. Detect orientation.
3. Load settings.
4. Initialize clock.
5. Initialize analog clock.
6. Initialize date.
7. Initialize device information.
8. Initialize weather if enabled.
9. Initialize world clocks.
10. Attempt wake lock if configured.
11. Start UI.
12. Hide controls after inactivity.

There should be no long loading screen.

The clock should appear almost immediately.

---

# 57. LOADING STATE

Never show a giant spinner.

If weather is loading:

```text
Weather
Loading…
```

The clock itself must already be visible.

---

# 58. VISUAL HIERARCHY

At 667×375:

The time should occupy approximately the visual center.

Example hierarchy:

```text
Main Time
████████████████

Day / Date
──────────────

Analog / Weather / Information
```

Do not make the weather card larger than the clock.

Do not make settings buttons visually dominant.

---

# 59. DESKTOP DEVELOPMENT MODE

Although iPhone 7 is the primary target, make the site pleasant to test on desktop.

On wide screens:

- constrain the clock to a reasonable aspect ratio
- optionally simulate the phone viewport
- center the clock
- do not stretch everything across a huge monitor

Optional:

Create a development preview frame around:

```text
667 × 375
```

but do not show the frame on the actual mobile layout.

---

# 60. TESTING REQUIREMENTS

Before considering the project finished, test:

### Time

- 12-hour
- 24-hour
- seconds on/off
- midnight
- date change

### Analog

- hour hand
- minute hand
- second hand
- smooth movement
- resizing

### Responsive

- 667×375
- 568×320
- desktop
- landscape
- portrait

### Settings

- save
- reload
- reset
- invalid localStorage

### Network

- online
- offline
- reconnect

### Battery

- supported
- unsupported

### Wake Lock

- supported
- unsupported
- denied

### Fullscreen

- supported
- unsupported

### Reduced motion

- enabled
- disabled

---

# 61. IMPORTANT PERFORMANCE TEST

The application may remain open for many hours.

Make sure there is no:

- memory leak
- continuously growing DOM
- repeated event registration
- unnecessary API calls
- runaway requestAnimationFrame
- excessive CPU usage

The clock should remain lightweight after:

```text
1 hour
6 hours
12 hours
24 hours
```

of continuous use.

---

# 62. FINAL VISUAL REQUIREMENT

The final result should feel like a premium dedicated smart clock.

Use:

- large typography
- subtle transparency
- clean spacing
- soft borders
- restrained shadows
- high contrast
- dark-room friendly colors
- smooth but minimal transitions

Avoid making it look like:

- an admin dashboard
- a weather app
- a generic Bootstrap website
- a gaming UI
- a cryptocurrency dashboard

The time is the hero.

---

# 63. IMPORTANT: DO NOT OVERENGINEER

Do not add unnecessary features simply because they are technically possible.

Prioritize:

```text
Accuracy
Performance
Readability
Simplicity
Touch usability
iPhone 7 compatibility
Long-running stability
```

over feature count.

---

# 64. DELIVERABLE

Create the complete working project.

Do not only provide snippets.

Generate:

```text
index.html
css/styles.css
js/app.js
js/clock.js
js/analog-clock.js
js/settings.js
js/weather.js
js/device.js
js/fullscreen.js
js/wake-lock.js
js/world-clock.js
manifest.webmanifest
sw.js
```

Make sure all imports and references work.

Do not leave fake functions such as:

```javascript
// TODO implement
```

for core functionality.

---

# 65. FINAL CODEX INSTRUCTIONS

Before finishing:

1. Inspect the entire project.
2. Verify every referenced file exists.
3. Verify there are no broken imports.
4. Verify JavaScript syntax.
5. Verify the clock starts immediately.
6. Verify settings persist.
7. Verify the analog clock is accurate.
8. Verify the digital clock is accurate.
9. Verify mobile landscape layout.
10. Verify the UI fits 667×375 without scrolling.
11. Verify touch targets.
12. Verify unsupported browser APIs fail gracefully.
13. Verify reduced-motion support.
14. Verify offline clock functionality.
15. Remove unnecessary code.
16. Optimize DOM updates.
17. Make the UI visually polished.
18. Do not leave debugging logs enabled in production.
19. Do not use placeholder lorem ipsum.
20. Do not add unnecessary dependencies.

The finished application should be immediately usable by opening:

```text
index.html
```

and should be easy to deploy to any static hosting provider.

Most importantly:

**Optimize the actual visual experience for an iPhone 7 held horizontally.**

The iPhone 7 landscape viewport is the primary product, not an afterthought.
