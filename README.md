# EcoNexus: Green Karabakh

An interactive ecological map of the liberated territories of Karabakh. It shows environmental data layers, scores how suitable a site is for sustainable development, and warns about nearby hazards.

Everything runs in the browser. There is no backend, no database and no AI: all scores come from transparent, rule-based logic over local static data.

> **Status:** hackathon MVP. The zone data is demonstration data, not survey data. Do not use it for real land-use or safety decisions.

## Features

### Map and layers
- Interactive Leaflet map with three base maps: Standard, Satellite and Terrain.
- Four toggleable ecological layers:
  - **Forest restoration zones**
  - **Solar energy zones**
  - **Water resources**, colored by drought risk
  - **Environmental risks** (mines, contamination)
- Search by city or district, with a fly-to animation and zones loaded for the chosen place.
- Map legend (collapsible).

### Suitability score (0–100)
Click any forest, solar or water zone to see an explainable score with a per-factor breakdown.

| Zone | Factors (max points) |
| --- | --- |
| Forest | Soil type (40), water nearby (35), area (25) |
| Solar | Sunny days per year (55), distance to the grid (45) |
| Water | Drought risk (100) |

Risk zones within **1 km** subtract up to 50 points, weighted by danger level and distance. Scores map to **High** (70+), **Medium** (40–69) and **Low** (below 40), and the recommendation text adapts to the result. The logic lives in [`src/utils/suitability.js`](src/utils/suitability.js).

### District dashboard
For the selected district: total forest hectares, average sunny days, number of water sources (and how many have high drought risk), number of risk zones, and the average suitability score.

### Safety: "Check Around"
Enable **My Location**, then **Check Around** to scan for known risk zones within **100 m**.
- A result card lists each risk, its danger level and distance, and **updates live as you move**.
- Dashed lines with distance labels connect you to each nearby risk, and the radius circle turns red.
- One-tap **Emergency Call** button (112).

### Checkpoints
Drop your own markers on the map (forest, solar, risk or note) with a title and description. They are stored in the browser's `localStorage`.

### UI
- Glass-style interface with vector icons from [lucide-react](https://lucide.dev).
- Toast notifications instead of blocking alerts.
- Responsive layout: on phones the layer panel and zone details become bottom sheets.

## Tech stack

- [React 18](https://react.dev) + [Vite 5](https://vitejs.dev)
- [Leaflet](https://leafletjs.com) via [react-leaflet](https://react-leaflet.js.org)
- [lucide-react](https://lucide.dev) icons
- Plain CSS, no UI framework
- OpenStreetMap, Esri and OpenTopoMap tiles

## Getting started

Requirements: Node.js 18 or newer.

```bash
npm install
npm run dev
```

The dev server starts on <http://localhost:3000>.

```bash
npm run build     # production build in dist/
npm run preview   # serve the production build locally
```

> Geolocation works only on `localhost` or over HTTPS.

## Project structure

```
src/
  App.jsx                   app state, search, geolocation, toasts
  components/
    MapContainer.jsx        Leaflet map, layers, markers, check radius
    LayerControls.jsx       layer toggles
    DistrictDashboard.jsx   per-district statistics
    InfoPanel.jsx           zone details + suitability breakdown
    CheckResult.jsx         live "Check Around" result card
    CheckpointModal.jsx     add-checkpoint form
    Legend.jsx, Toast.jsx, MapTypeSelector.jsx, ZoomControls.jsx
    Icon.jsx                icon registry (lucide-react) and map marker badges
  data/
    locations.js            searchable cities and districts
    cityZones.js            zones per city
    embeddedData.js         default demo region
  utils/
    geo.js                  haversine distance, nearby-risk lookup
    suitability.js          scoring rules, recommendations, district summary
data/                       original JSON datasets
```

## Data

Zone data is hand-made demonstration data:

- `src/data/cityZones.js` holds forest, solar, water and risk zones for each city.
- `src/data/embeddedData.js` holds the default demo region.
- `data/*.json` contains the original datasets from the first version.

To add a district, add an entry to `cityZonesData` in `cityZones.js` and a matching item in `locations.js`.

## Roadmap

- Dark theme
- Azerbaijani / Russian / English interface
- Filters by area, sunny days and danger level
- Side-by-side district comparison
- Export / import of checkpoints (JSON / CSV)
- Shareable links that keep the selected district and layers
- Replace demo data with real survey data

## Disclaimer

Mine-risk and contamination zones shown here are illustrative. Never rely on this app to decide whether an area is safe; follow official demining and safety authorities.
