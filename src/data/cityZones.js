// Zone data for each city in Karabakh region
// Each city has its own zones within a small radius

export const cityZonesData = {
  "Ağdam": {
    forests: [
      { name: "Ağdam Forest North", lat: 40.020, lng: 46.950, area: 120, soil: "fertile", water_nearby: true },
      { name: "Ağdam Forest South", lat: 39.965, lng: 46.900, area: 85, soil: "moderate", water_nearby: true },
      { name: "Ağdam Forest East", lat: 39.995, lng: 46.960, area: 150, soil: "fertile", water_nearby: false }
    ],
    solar: [
      { name: "Ağdam Solar Zone 1", lat: 40.010, lng: 46.940, sun_days: 270, distance_to_grid: 4 },
      { name: "Ağdam Solar Zone 2", lat: 39.975, lng: 46.920, sun_days: 285, distance_to_grid: 2 },
      { name: "Ağdam Solar Zone 3", lat: 40.000, lng: 46.955, sun_days: 265, distance_to_grid: 5 }
    ],
    water: [
      { type: "river", name: "Ağdam River", lat: 39.970, lng: 46.910, drought_risk: "medium" },
      { type: "spring", name: "Ağdam Spring", lat: 40.005, lng: 46.945, drought_risk: "low" },
      { type: "well", name: "Ağdam Well Site", lat: 39.985, lng: 46.930, drought_risk: "medium" }
    ],
    risks: [
      { type: "mine", lat: 40.015, lng: 46.965, danger_level: "high", description: "Mine-contaminated area - requires clearance" },
      { type: "contamination", lat: 39.960, lng: 46.890, danger_level: "medium", description: "Environmental contamination zone" }
    ]
  },
  "Xankəndi": {
    forests: [
      { name: "Xankəndi Forest West", lat: 39.7900, lng: 46.7200, area: 95, soil: "fertile", water_nearby: true },
      { name: "Xankəndi Forest East", lat: 39.8400, lng: 46.7800, area: 110, soil: "moderate", water_nearby: false }
    ],
    solar: [
      { name: "Xankəndi Solar Zone 1", lat: 39.8000, lng: 46.7300, sun_days: 280, distance_to_grid: 3 },
      { name: "Xankəndi Solar Zone 2", lat: 39.8300, lng: 46.7700, sun_days: 275, distance_to_grid: 4 }
    ],
    water: [
      { type: "river", name: "Xankəndi River", lat: 39.7850, lng: 46.7400, drought_risk: "low" },
      { type: "spring", name: "Xankəndi Spring", lat: 39.8350, lng: 46.7600, drought_risk: "low" }
    ],
    risks: [
      { type: "mine", lat: 39.8050, lng: 46.7650, danger_level: "medium", description: "Mine-contaminated area" }
    ]
  },
  "Şuşa": {
    forests: [
      { name: "Şuşa Forest North", lat: 39.8000, lng: 46.7800, area: 130, soil: "fertile", water_nearby: true },
      { name: "Şuşa Forest South", lat: 39.7200, lng: 46.7200, area: 100, soil: "moderate", water_nearby: true }
    ],
    solar: [
      { name: "Şuşa Solar Zone 1", lat: 39.7900, lng: 46.7700, sun_days: 290, distance_to_grid: 2 },
      { name: "Şuşa Solar Zone 2", lat: 39.7300, lng: 46.7300, sun_days: 285, distance_to_grid: 3 }
    ],
    water: [
      { type: "river", name: "Şuşa River", lat: 39.7750, lng: 46.7600, drought_risk: "low" },
      { type: "spring", name: "Şuşa Spring", lat: 39.7450, lng: 46.7400, drought_risk: "low" }
    ],
    risks: [
      { type: "mine", lat: 39.7850, lng: 46.7750, danger_level: "high", description: "Mine-contaminated area - requires clearance" }
    ]
  },
  "Füzuli": {
    forests: [
      { name: "Füzuli Forest North", lat: 39.6500, lng: 47.1800, area: 140, soil: "fertile", water_nearby: true },
      { name: "Füzuli Forest South", lat: 39.5500, lng: 47.1200, area: 90, soil: "moderate", water_nearby: false }
    ],
    solar: [
      { name: "Füzuli Solar Zone 1", lat: 39.6400, lng: 47.1700, sun_days: 300, distance_to_grid: 1 },
      { name: "Füzuli Solar Zone 2", lat: 39.5600, lng: 47.1300, sun_days: 295, distance_to_grid: 2 }
    ],
    water: [
      { type: "river", name: "Füzuli River", lat: 39.6200, lng: 47.1600, drought_risk: "medium" },
      { type: "well", name: "Füzuli Well", lat: 39.5800, lng: 47.1400, drought_risk: "low" }
    ],
    risks: [
      { type: "mine", lat: 39.6300, lng: 47.1750, danger_level: "high", description: "Mine-contaminated area - requires clearance" },
      { type: "contamination", lat: 39.5700, lng: 47.1250, danger_level: "medium", description: "Environmental contamination zone" }
    ]
  },
  "Cəbrayıl": {
    forests: [
      { name: "Cəbrayıl Forest West", lat: 39.3700, lng: 46.9800, area: 105, soil: "moderate", water_nearby: true },
      { name: "Cəbrayıl Forest East", lat: 39.4300, lng: 47.0500, area: 125, soil: "fertile", water_nearby: true }
    ],
    solar: [
      { name: "Cəbrayıl Solar Zone 1", lat: 39.3800, lng: 47.0000, sun_days: 275, distance_to_grid: 5 },
      { name: "Cəbrayıl Solar Zone 2", lat: 39.4200, lng: 47.0400, sun_days: 270, distance_to_grid: 6 }
    ],
    water: [
      { type: "river", name: "Cəbrayıl River", lat: 39.3750, lng: 47.0100, drought_risk: "high" },
      { type: "well", name: "Cəbrayıl Well", lat: 39.4250, lng: 47.0450, drought_risk: "medium" }
    ],
    risks: [
      { type: "mine", lat: 39.3900, lng: 47.0050, danger_level: "high", description: "Mine-contaminated area - requires clearance" }
    ]
  },
  "Zəngilan": {
    forests: [
      { name: "Zəngilan Forest North", lat: 39.1300, lng: 46.6800, area: 115, soil: "fertile", water_nearby: true }
    ],
    solar: [
      { name: "Zəngilan Solar Zone 1", lat: 39.0400, lng: 46.6200, sun_days: 285, distance_to_grid: 4 }
    ],
    water: [
      { type: "river", name: "Zəngilan River", lat: 39.1000, lng: 46.6700, drought_risk: "medium" }
    ],
    risks: [
      { type: "mine", lat: 39.0700, lng: 46.6400, danger_level: "medium", description: "Mine-contaminated area" }
    ]
  },
  "Qubadlı": {
    forests: [
      { name: "Qubadlı Forest West", lat: 39.3200, lng: 46.5500, area: 100, soil: "moderate", water_nearby: false },
      { name: "Qubadlı Forest East", lat: 39.3800, lng: 46.6200, area: 120, soil: "fertile", water_nearby: true }
    ],
    solar: [
      { name: "Qubadlı Solar Zone 1", lat: 39.3300, lng: 46.5600, sun_days: 290, distance_to_grid: 3 },
      { name: "Qubadlı Solar Zone 2", lat: 39.3700, lng: 46.6100, sun_days: 280, distance_to_grid: 4 }
    ],
    water: [
      { type: "river", name: "Qubadlı River", lat: 39.3250, lng: 46.5700, drought_risk: "medium" },
      { type: "spring", name: "Qubadlı Spring", lat: 39.3750, lng: 46.6050, drought_risk: "low" }
    ],
    risks: [
      { type: "mine", lat: 39.3400, lng: 46.5800, danger_level: "high", description: "Mine-contaminated area - requires clearance" }
    ]
  },
  "Laçın": {
    forests: [
      { name: "Laçın Forest North", lat: 39.6400, lng: 46.5900, area: 110, soil: "fertile", water_nearby: true },
      { name: "Laçın Forest South", lat: 39.5600, lng: 46.5100, area: 95, soil: "moderate", water_nearby: true }
    ],
    solar: [
      { name: "Laçın Solar Zone 1", lat: 39.6300, lng: 46.5800, sun_days: 275, distance_to_grid: 5 },
      { name: "Laçın Solar Zone 2", lat: 39.5700, lng: 46.5200, sun_days: 270, distance_to_grid: 6 }
    ],
    water: [
      { type: "river", name: "Laçın River", lat: 39.6200, lng: 46.5700, drought_risk: "low" },
      { type: "well", name: "Laçın Well", lat: 39.5800, lng: 46.5300, drought_risk: "low" }
    ],
    risks: [
      { type: "mine", lat: 39.6100, lng: 46.5600, danger_level: "medium", description: "Mine-contaminated area" }
    ]
  },
  "Kəlbəcər": {
    forests: [
      { name: "Kəlbəcər Forest North", lat: 40.1500, lng: 46.0800, area: 150, soil: "fertile", water_nearby: true },
      { name: "Kəlbəcər Forest South", lat: 40.0650, lng: 46.0000, area: 130, soil: "fertile", water_nearby: true }
    ],
    solar: [
      { name: "Kəlbəcər Solar Zone 1", lat: 40.1400, lng: 46.0700, sun_days: 260, distance_to_grid: 7 },
      { name: "Kəlbəcər Solar Zone 2", lat: 40.0750, lng: 46.0100, sun_days: 255, distance_to_grid: 8 }
    ],
    water: [
      { type: "river", name: "Kəlbəcər River", lat: 40.1300, lng: 46.0600, drought_risk: "low" },
      { type: "spring", name: "Kəlbəcər Spring", lat: 40.0850, lng: 46.0200, drought_risk: "low" }
    ],
    risks: [
      { type: "mine", lat: 40.1200, lng: 46.0500, danger_level: "high", description: "Mine-contaminated area - requires clearance" }
    ]
  },
  "Ağdərə": {
    forests: [
      { name: "Ağdərə Forest West", lat: 40.1900, lng: 46.7800, area: 125, soil: "fertile", water_nearby: true },
      { name: "Ağdərə Forest East", lat: 40.2450, lng: 46.8550, area: 110, soil: "moderate", water_nearby: false }
    ],
    solar: [
      { name: "Ağdərə Solar Zone 1", lat: 40.2000, lng: 46.8000, sun_days: 280, distance_to_grid: 3 },
      { name: "Ağdərə Solar Zone 2", lat: 40.2350, lng: 46.8450, sun_days: 275, distance_to_grid: 4 }
    ],
    water: [
      { type: "river", name: "Ağdərə River", lat: 40.1950, lng: 46.7900, drought_risk: "low" },
      { type: "spring", name: "Ağdərə Spring", lat: 40.2400, lng: 46.8500, drought_risk: "low" }
    ],
    risks: [
      { type: "mine", lat: 40.2100, lng: 46.8200, danger_level: "medium", description: "Mine-contaminated area" }
    ]
  }
}

// Default zones (when no city is selected)
export const defaultZones = {
  forests: [
    { name: "Forest Zone A", lat: 39.994, lng: 46.923, area: 120, soil: "fertile", water_nearby: true },
    { name: "Forest Zone B", lat: 39.975, lng: 46.915, area: 85, soil: "moderate", water_nearby: true },
    { name: "Forest Zone C", lat: 39.985, lng: 46.905, area: 150, soil: "fertile", water_nearby: false }
  ],
  solar: [
    { name: "Solar Zone 1", lat: 39.981, lng: 46.902, sun_days: 270, distance_to_grid: 4 },
    { name: "Solar Zone 2", lat: 39.972, lng: 46.925, sun_days: 285, distance_to_grid: 2 },
    { name: "Solar Zone 3", lat: 39.990, lng: 46.910, sun_days: 265, distance_to_grid: 5 }
  ],
  water: [
    { type: "river", name: "River X", lat: 39.972, lng: 46.911, drought_risk: "medium" },
    { type: "spring", name: "Spring A", lat: 39.988, lng: 46.918, drought_risk: "low" },
    { type: "river", name: "River Y", lat: 39.965, lng: 46.920, drought_risk: "high" },
    { type: "well", name: "Well Site 1", lat: 39.978, lng: 46.908, drought_risk: "medium" }
  ],
  risks: [
    { type: "mine", lat: 39.988, lng: 46.932, danger_level: "high", description: "Mine-contaminated area - requires clearance" },
    { type: "mine", lat: 39.970, lng: 46.900, danger_level: "high", description: "Mine-contaminated area - requires clearance" },
    { type: "contamination", lat: 39.980, lng: 46.930, danger_level: "medium", description: "Environmental contamination zone" }
  ]
}

