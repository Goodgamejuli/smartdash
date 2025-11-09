# Smartdash – Smart‑Home Dashboard UI Prototype

This project contains a minimal **Vite + React + TypeScript** setup that serves as
a starting point for building an interactive Smart‑Home network dashboard. It
focuses on the **visual UI** and includes scaffolding for a device palette,
topology canvas and rolling log. There is no backend or data simulation yet –
those can be added later.

## Projektstruktur

```
smartdash/
├─ index.html               # HTML‑Eintrittspunkt
├─ package.json             # Abhängigkeiten und Skripte
├─ tsconfig.json            # TypeScript‑Konfiguration
├─ tailwind.config.cjs      # Tailwind CSS‑Konfiguration
├─ postcss.config.cjs       # PostCSS‑Konfiguration
├─ vite.config.ts           # Vite‑Konfiguration
├─ src/
│  ├─ main.tsx             # Einstieg für React
│  ├─ index.css            # Globale Stile (inkl. Tailwind)
│  ├─ App.tsx              # Wurzelkomponente
│  ├─ pages/
│  │   └─ AppShell.tsx     # Layout der Hauptbereiche (Palette | Canvas | Log)
│  ├─ components/
│  │   ├─ TopBar.tsx       # obere Leiste
│  │   ├─ DevicePalette.tsx# Gerätepalette (Platzhalter)
│  │   ├─ TopologyCanvas.tsx # Topologie‑Canvas (Platzhalter)
│  │   └─ RollingLog.tsx   # rollendes Log (Platzhalter)
│  ├─ store/
│  │   └─ useTopologyStore.ts # Zustandsspeicher mit Zustand (Geräte, Kanten, Log)
│  └─ model/
│     ├─ schema.ts         # Typdefinitionen für Geräte, Kanten, Events
│     ├─ protocols.ts      # Farben für Protokolle
│     └─ deviceTypes.ts    # Liste der unterstützten Gerätetypen
└─ README.md               # Diese Datei
```

## Installation und Ausführung

1. **Node.js installieren.** Das Projekt benötigt eine aktuelle Node.js
   Version. Laut der offiziellen Vite‑Dokumentation sollte Node.js
   mindestens Version 20 oder 22 sein【534576171086071†L232-L256】. Bei Bedarf
   einfach die LTS‑Version von [nodejs.org](https://nodejs.org/) herunterladen.

2. **Abhängigkeiten installieren.** Öffne ein Terminal im Projektordner und führe aus:
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten.** Zum Testen der Benutzeroberfläche:
   ```bash
   npm run dev
   ```
   Vite startet einen lokalen Server, typischerweise unter
   `http://localhost:5173`. Änderungen am Code werden automatisch geladen.

4. **Produktionsbuild erzeugen.** Um eine optimierte Version zu erzeugen:
   ```bash
   npm run build
   ```
   Die Dateien werden im Ordner `dist/` abgelegt. Mit `npm run preview`
   kann das Ergebnis lokal getestet werden.

## Nächste Schritte

* **Drag & Drop implementieren** in `DevicePalette.tsx` und
  `TopologyCanvas.tsx`, beispielsweise mit `@dnd-kit/core`.
* **Nodes und Kanten rendern** mit React Flow (`@xyflow/react`).
* **Rolling Log befüllen** und Buttons hinzufügen, um Ereignisse zu simulieren.
* **Speichern/Laden** der Topologie über JSON.

Mit diesem Grundgerüst kannst du die Benutzeroberfläche nach deinen
Anforderungen erweitern und Schritt für Schritt eine interaktive Smart‑Home
Topologie darstellen. Viel Erfolg!