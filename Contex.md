# 🌿 Green Karabakh — MVP Technical & Functional Specification

## Document Purpose

This document provides a **clear, honest, and implementation-ready description** of the MVP for the project **“Green Karabakh”**. It is written for a **frontend developer** who will implement the application as a **pure web-based solution** without AI or backend services.

The MVP is designed for a **hackathon context** and focuses on clarity, feasibility, and demonstrable value.

---

## 1. Project Overview

**Green Karabakh** is a web-based interactive ecological map that visualizes environmental conditions of selected liberated territories and provides **rule-based recommendations** for sustainable development projects.

The application:

* visualizes ecological data layers on a map
* allows users to interact with zones
* generates simple, explainable recommendations

---

## 2. Scope of MVP

### Included in MVP

* Web application (browser-based)
* Interactive map (Leaflet)
* One selected region (demo area)
* Four ecological layers
* Rule-based recommendation logic
* Local static data (JSON)

### Excluded from MVP

* Artificial Intelligence / Machine Learning
* Backend / Database
* User accounts or authentication
* Real-time or live data

---

## 3. Technology Stack

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript (ES6)
* Leaflet.js (map rendering)
* OpenStreetMap tiles

### Data Handling

* Local static JSON files
* No server-side processing

---

## 4. Project File Structure

```
green-karabakh/
│
├── index.html        # Main HTML structure
├── style.css         # Application styling
├── main.js           # Core application logic
│
├── data/              # Static data sources
│   ├── region.json
│   ├── forests.json
│   ├── solar.json
│   ├── water.json
│   └── risks.json
│
└── assets/
    └── icons/         # Map icons
```

---

## 5. User Interface Overview

### Layout Description

* **Top bar**: Project title
* **Left panel**: Layer controls (checkboxes)
* **Center**: Interactive map
* **Right panel**: Information & recommendation panel

---

## 6. Map Initialization

### Map Setup

* Centered on selected region coordinates
* Fixed zoom level suitable for one district
* Base layer: OpenStreetMap

---

## 7. Ecological Layers

Each layer can be toggled on/off via the left panel.

---

### 7.1 Forest Restoration Zones

**Purpose:** Identify areas suitable for reforestation.

**Data Source:** `forests.json`

```json
[
  {
    "name": "Forest Zone A",
    "lat": 39.994,
    "lng": 46.923,
    "area": 120,
    "soil": "fertile",
    "water_nearby": true
  }
]
```

**Visualization:**

* Green circles or polygons

**On Click (Popup / Info Panel):**

* Zone name
* Area size
* Soil type
* Water availability

---

### 7.2 Solar Energy Zones

**Purpose:** Highlight areas suitable for solar power plants.

**Data Source:** `solar.json`

```json
[
  {
    "name": "Solar Zone 1",
    "lat": 39.981,
    "lng": 46.902,
    "sun_days": 270,
    "distance_to_grid": 4
  }
]
```

**Visualization:**

* Yellow solar icons

**Displayed Parameters:**

* Annual sunny days
* Distance to power grid

---

### 7.3 Water Resources & Drought Risk

**Purpose:** Show water availability and drought risk.

**Data Source:** `water.json`

```json
[
  {
    "type": "river",
    "name": "River X",
    "lat": 39.972,
    "lng": 46.911,
    "drought_risk": "medium"
  }
]
```

**Visualization:**

* Blue lines or points
* Color-coded risk levels:

  * low → blue
  * medium → orange
  * high → red

---

### 7.4 Environmental Risk Zones

**Purpose:** Indicate dangerous or restricted areas, especially for local residents.

**Data Source:** `risks.json`

```json
[
  {
    "type": "mine",
    "lat": 39.988,
    "lng": 46.932,
    "danger_level": "high"
  }
]
```

**Visualization:**

* Red warning icons and red highlighted zones

**Meaning for Users:**

* These zones represent **mine-contaminated or environmentally dangerous areas**
* They are clearly visible to ensure **safety awareness**, especially for residents

**For Local Residents:**

* Red zones act as **visual warnings**
* Help residents understand which areas should be avoided
* Increase transparency and public safety

**On Click:**

* Warning message
* Explanation of the danger
* Recommendation to avoid the area until clearance

---

## 8. Recommendation Logic (Rule-Based)

### Purpose

Provide **clear and explainable recommendations** without AI.

### Trigger

* User clicks on a zone

### Input Data

* Water availability
* Risk level
* Solar potential

---

### Recommendation Rules

```js
function getRecommendation(zone) {
  if (zone.water && zone.risk === "low") {
    return "Suitable for forest restoration 🌱";
  }

  if (zone.sun_days > 260 && zone.risk !== "high") {
    return "Recommended for solar power installation ☀️";
  }

  return "Additional environmental assessment required";
}
```

### Explanation (for presentation)

> The system applies predefined environmental rules to available data to generate development recommendations.

---

## 9. Information Panel Behavior

When a user clicks a zone:

```
Zone Name
Zone Type
Environmental Parameters
Risk Information
System Recommendation
```

The panel updates dynamically using JavaScript.

---

## 9.1 Interactive Map Features (Checkpoints & Notes)

### Purpose

Transform the map from a passive visualization tool into an **interactive working environment** for analysis, planning, and discussion.

### Checkpoints

Users can place **custom checkpoints** directly on the map.

**How it works:**

1. User clicks anywhere on the map
2. A checkpoint marker appears
3. A small form opens allowing the user to:

   * enter a title
   * select checkpoint type
   * add a short note

**Checkpoint Types:**

* 🌱 Forest checkpoint (planned reforestation)
* ☀️ Solar checkpoint (renewable energy idea)
* ⚠️ Risk checkpoint (danger or limitation)
* 📝 General note (observation or comment)

Each checkpoint has its own icon and color for clarity.

### Notes on the Map

Every checkpoint contains a **contextual note**, for example:

> "This area may be suitable for reforestation after demining."

### Data Storage (MVP)

* Checkpoints are stored locally using browser `localStorage`
* No backend or user accounts are required

This approach keeps the MVP simple while demonstrating strong practical value.

---

## 10. Data Nature Disclaimer

All data used in MVP:

* is demonstrational (mock)
* represents a prototype model

**Scalability:**
The system architecture allows replacement of static JSON files with real governmental or international data sources without changing application logic.

---

## 11. Demo Flow (Hackathon Presentation)

1. Open the website
2. Enable water layer
3. Enable risk layer
4. Click a zone
5. Show recommendation
6. Explain rule logic

---

## 12. Future Development (Post-MVP)

* Integration with real GIS data
* Backend API
* Advanced analytics
* Mobile version
* Governmental system integration

---

## 13. Key Value Proposition

* Clear ecological visualization
* Decision-support logic
* Scalable architecture
* Honest MVP scope
* High social impact

---

**End of Document**
