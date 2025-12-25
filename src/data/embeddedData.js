// Embedded data for Green Karabakh (no server needed)
export const embeddedData = {
    region: {
        name: "Karabakh Region",
        center: { lat: 39.98, lng: 46.92 },
        zoom: 12
    },
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
};

