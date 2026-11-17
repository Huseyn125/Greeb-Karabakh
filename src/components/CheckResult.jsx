import React from 'react'
import Icon from './Icon'
import { formatDistance } from '../utils/geo'
import './extras.css'

function CheckResult({ risks, radius, onClose }) {
  const safe = risks.length === 0

  return (
    <div className={`check-result ${safe ? 'safe' : 'danger'}`} role="alert">
      <div className="check-result-head">
        <strong className="with-icon">
          <Icon name={safe ? 'success' : 'warning'} size={18} color={safe ? '#22c55e' : '#ef4444'} />
          {safe ? `No risk zones within ${radius} m` : `${risks.length} risk zone(s) within ${radius} m`}
        </strong>
        <button className="toast-close" onClick={onClose} aria-label="Close">
          <Icon name="close" size={14} />
        </button>
      </div>
      {!safe && (
        <ul>
          {risks.map((risk, i) => (
            <li key={i}>
              <span className="check-type">{risk.type}</span>
              <span className={`check-level level-${risk.danger_level}`}>{risk.danger_level}</span>
              <span className="check-dist">{formatDistance(risk.distance)}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="check-hint">Updates live as you move.</p>
    </div>
  )
}

export default CheckResult
