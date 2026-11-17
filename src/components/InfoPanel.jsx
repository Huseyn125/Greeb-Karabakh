import React, { useMemo } from 'react'
import Icon, { ICON_COLORS } from './Icon'
import { evaluateZone, getRecommendation } from '../utils/suitability'
import { formatDistance } from '../utils/geo'
import './InfoPanel.css'
import './extras.css'

const TYPE_LABELS = {
  forest: 'Forest Restoration Zone',
  solar: 'Solar Energy Zone',
  water: 'Water Resource',
  risk: 'Risk Zone',
  checkpoint: 'Checkpoint'
}

const DROUGHT_COLORS = { low: '#3b82f6', medium: '#f97316', high: '#ef4444' }

function Detail({ label, children, color }) {
  return (
    <div className="detail-item">
      <span className="detail-label">{label}</span>
      <span className="detail-value" style={color ? { color } : undefined}>{children}</span>
    </div>
  )
}

function Suitability({ evaluation }) {
  const { score, level, factors, penalty, nearRisks } = evaluation
  return (
    <div className="suitability" style={{ '--c': level.color }}>
      <div className="suitability-head">
        <span>Suitability</span>
        <div className="suitability-score">
          {score}<small> / 100 · {level.label}</small>
        </div>
      </div>
      <div className="score-bar" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
        <div style={{ width: `${score}%` }} />
      </div>
      <ul className="factor-list">
        {factors.map((f) => (
          <li key={f.label}>
            <span>{f.label}</span>
            <span className="pts">{f.points}/{f.max}</span>
          </li>
        ))}
        {penalty > 0 && (
          <li className="penalty">
            <span>
              Nearby risks ({nearRisks.length}, closest {formatDistance(nearRisks[0].distance)})
            </span>
            <span className="pts">−{penalty}</span>
          </li>
        )}
      </ul>
    </div>
  )
}

function InfoPanel({ selectedZone, onClose, onDeleteCheckpoint, risks = [] }) {
  const kind = selectedZone?.kind

  const evaluation = useMemo(
    () => (selectedZone ? evaluateZone(kind, selectedZone, risks) : null),
    [kind, selectedZone, risks]
  )

  if (!selectedZone) {
    return null
  }

  const zone = selectedZone

  return (
    <div className="info-panel">
      <div className="info-panel-header">
        <h2>Zone Details</h2>
        <button className="close-button" onClick={onClose} aria-label="Close"><Icon name="close" size={16} /></button>
      </div>

      <div className="info-panel-content">
        <div className="zone-header">
          <h3>{zone.name || zone.title || zone.type}</h3>
          <span className="zone-type with-icon">
            <Icon name={kind === 'checkpoint' ? 'pin' : kind} size={14} color={ICON_COLORS[kind]} />
            {TYPE_LABELS[kind] || kind}
          </span>
        </div>

        {evaluation && <Suitability evaluation={evaluation} />}

        {kind === 'forest' && (
          <div className="zone-details">
            <Detail label="Area:">{zone.area} hectares</Detail>
            <Detail label="Soil Type:">{zone.soil}</Detail>
            <Detail label="Water Nearby:">{zone.water_nearby ? 'Yes' : 'No'}</Detail>
          </div>
        )}

        {kind === 'solar' && (
          <div className="zone-details">
            <Detail label="Sunny Days:">{zone.sun_days}/year</Detail>
            <Detail label="Distance to Grid:">{zone.distance_to_grid} km</Detail>
          </div>
        )}

        {kind === 'water' && (
          <div className="zone-details">
            <Detail label="Resource Type:"><span style={{ textTransform: 'capitalize' }}>{zone.type}</span></Detail>
            <Detail label="Drought Risk:" color={DROUGHT_COLORS[zone.drought_risk]}>{zone.drought_risk}</Detail>
          </div>
        )}

        {kind === 'risk' && (
          <div className="zone-details">
            <Detail label="Hazard:"><span style={{ textTransform: 'capitalize' }}>{zone.type}</span></Detail>
            <Detail label="Danger Level:" color="#ef4444">{zone.danger_level}</Detail>
            {zone.description && <Detail label="Description:">{zone.description}</Detail>}
          </div>
        )}

        {kind === 'checkpoint' && (
          <div className="zone-details">
            <Detail label="Note:">{zone.note || 'No additional notes'}</Detail>
            <Detail label="Created:">{new Date(zone.timestamp).toLocaleString()}</Detail>
            <Detail label="Location:">{zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}</Detail>
            {onDeleteCheckpoint && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', width: '100%' }}>
                <button
                  className="delete-checkpoint-button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this checkpoint?')) {
                      onDeleteCheckpoint(zone.id)
                      onClose()
                    }
                  }}
                >
                  <Icon name="trash" size={16} /> Delete
                </button>
              </div>
            )}
          </div>
        )}

        <div className={kind === 'risk' ? 'warning' : 'recommendation'}>
          <strong className="with-icon">
            <Icon name={kind === 'risk' ? 'warning' : 'tip'} size={16} color={kind === 'risk' ? '#ef4444' : '#16a34a'} />
            {kind === 'risk' ? 'Warning:' : 'Recommendation:'}
          </strong>{' '}
          {getRecommendation(kind, zone, evaluation)}
        </div>
      </div>
    </div>
  )
}

export default InfoPanel
