// Rule-based suitability scoring. Every score is explainable:
// it is the sum of named factors minus a penalty for nearby risk zones.

import { findRisksWithin } from './geo'

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

// Risk zones closer than this reduce the score of a site.
export const RISK_INFLUENCE_RADIUS_M = 1000

const DANGER_WEIGHT = { high: 40, medium: 25, low: 10 }

export function scoreLevel(score) {
  if (score >= 70) return { id: 'high', label: 'High', color: '#16a34a' }
  if (score >= 40) return { id: 'medium', label: 'Medium', color: '#f59e0b' }
  return { id: 'low', label: 'Low', color: '#ef4444' }
}

function riskPenalty(zone, risks) {
  const near = findRisksWithin(zone, risks, RISK_INFLUENCE_RADIUS_M)
  const raw = near.reduce((sum, risk) => {
    const weight = DANGER_WEIGHT[risk.danger_level] ?? 20
    return sum + weight * (1 - risk.distance / RISK_INFLUENCE_RADIUS_M)
  }, 0)
  return { penalty: Math.round(Math.min(raw, 50)), near }
}

function baseFactors(kind, zone) {
  if (kind === 'forest') {
    const soilPts = { fertile: 40, moderate: 25, poor: 10 }[zone.soil] ?? 15
    return [
      { label: `Soil: ${zone.soil}`, points: soilPts, max: 40 },
      { label: zone.water_nearby ? 'Water nearby' : 'No water nearby', points: zone.water_nearby ? 35 : 0, max: 35 },
      { label: `Area: ${zone.area} ha`, points: Math.round(clamp(zone.area / 150) * 25), max: 25 }
    ]
  }
  if (kind === 'solar') {
    return [
      { label: `Sunny days: ${zone.sun_days}/yr`, points: Math.round(clamp((zone.sun_days - 240) / 50) * 55), max: 55 },
      { label: `Grid distance: ${zone.distance_to_grid} km`, points: Math.round((1 - clamp(zone.distance_to_grid / 8)) * 45), max: 45 }
    ]
  }
  if (kind === 'water') {
    const pts = { low: 100, medium: 60, high: 25 }[zone.drought_risk] ?? 50
    return [{ label: `Drought risk: ${zone.drought_risk}`, points: pts, max: 100 }]
  }
  return []
}

/**
 * Suitability of a forest / solar / water zone.
 * Returns null for kinds that cannot be scored (risk, checkpoint).
 */
export function evaluateZone(kind, zone, risks = []) {
  const factors = baseFactors(kind, zone)
  if (factors.length === 0) return null

  const base = factors.reduce((sum, f) => sum + f.points, 0)
  const { penalty, near } = riskPenalty(zone, risks)
  const score = Math.max(0, Math.min(100, base - penalty))
  return { score, base, penalty, nearRisks: near, factors, level: scoreLevel(score) }
}

export function getRecommendation(kind, zone, evaluation) {
  if (kind === 'risk') {
    return 'This area should be avoided until proper clearance and safety measures are implemented.'
  }
  if (kind === 'checkpoint') {
    return `Checkpoint created: ${new Date(zone.timestamp).toLocaleString()}`
  }
  if (!evaluation) return 'Additional environmental assessment required.'

  const blocked = evaluation.penalty >= 25
    ? ' Nearby risk zones must be cleared before any works.'
    : ''
  const level = evaluation.level.id

  if (kind === 'forest') {
    if (level === 'high') return `Suitable for forest restoration 🌱${blocked}`
    if (level === 'medium') return `Moderately suitable for forest restoration. ${zone.water_nearby ? 'Consider soil improvement.' : 'Water access is needed.'}${blocked}`
    return `Not recommended without a detailed assessment.${blocked}`
  }
  if (kind === 'solar') {
    if (level === 'high') return `Highly recommended for solar power installation ☀️${blocked}`
    if (level === 'medium') return `Suitable for solar power; ${zone.distance_to_grid > 4 ? 'grid connection will raise costs.' : 'moderate sun potential.'}${blocked}`
    return `Low solar potential. Consider alternative locations.${blocked}`
  }
  if (kind === 'water') {
    if (zone.drought_risk === 'low') return `Reliable water source, suitable for development projects.${blocked}`
    if (zone.drought_risk === 'medium') return `Water availability may vary. Monitor conditions.${blocked}`
    return `High drought risk. Water conservation measures required.${blocked}`
  }
  return 'Additional environmental assessment required.'
}

/** Aggregated numbers for the district dashboard. */
export function summarizeDistrict({ forests = [], solar = [], water = [], risks = [] }) {
  const evaluated = [
    ...forests.map((z) => evaluateZone('forest', z, risks)),
    ...solar.map((z) => evaluateZone('solar', z, risks)),
    ...water.map((z) => evaluateZone('water', z, risks))
  ]
  const avg = evaluated.length
    ? Math.round(evaluated.reduce((s, e) => s + e.score, 0) / evaluated.length)
    : null
  const sun = solar.length
    ? Math.round(solar.reduce((s, z) => s + z.sun_days, 0) / solar.length)
    : null

  return {
    forestHectares: forests.reduce((s, z) => s + z.area, 0),
    forestCount: forests.length,
    solarCount: solar.length,
    avgSunDays: sun,
    waterCount: water.length,
    droughtHigh: water.filter((w) => w.drought_risk === 'high').length,
    riskCount: risks.length,
    riskHigh: risks.filter((r) => r.danger_level === 'high').length,
    avgScore: avg,
    level: avg === null ? null : scoreLevel(avg)
  }
}
