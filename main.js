const logOutput = document.getElementById("log-output");
const addLogButton = document.getElementById("add-log");
const addBurstButton = document.getElementById("add-burst");

const LOG_LEVELS = [
  { level: "info", className: "" },
  { level: "warn", className: "log-entry--warn" },
  { level: "error", className: "log-entry--error" }
];

const addLogEntry = (message, level = "info") => {
  const wrapper = document.createElement("div");
  wrapper.className = ["log-entry", getLevelClass(level)].filter(Boolean).join(" ");
  wrapper.dataset.timestamp = new Date().toLocaleTimeString();
  wrapper.textContent = message;

  logOutput.appendChild(wrapper);
  requestAnimationFrame(() => {
    logOutput.scrollTop = logOutput.scrollHeight;
  });
};

const getLevelClass = (level) => {
  const entry = LOG_LEVELS.find((item) => item.level === level);
  return entry?.className ?? "";
};

const randomMessage = () => {
  const verbs = ["Lade", "Analysiere", "Berechne", "Erzeuge", "Validiere"];
  const objects = ["Dashboard", "KPI", "Bericht", "Metrik", "Widget"];
  const statuses = [
    "abgeschlossen",
    "gestartet",
    "erfolgreich",
    "fehlgeschlagen",
    "wartet"
  ];

  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  const object = objects[Math.floor(Math.random() * objects.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  return `${verb} ${object} – Status ${status}`;
};

const randomLevel = () => {
  const index = Math.floor(Math.random() * LOG_LEVELS.length);
  return LOG_LEVELS[index].level;
};

addLogButton?.addEventListener("click", () => {
  addLogEntry(randomMessage(), randomLevel());
});

addBurstButton?.addEventListener("click", () => {
  for (let i = 0; i < 15; i += 1) {
    setTimeout(() => {
      addLogEntry(randomMessage(), randomLevel());
    }, i * 120);
  }
});

// Seed initial log output
for (let i = 0; i < 20; i += 1) {
  addLogEntry(randomMessage(), randomLevel());
}
