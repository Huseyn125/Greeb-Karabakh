import React, { useMemo } from 'react'
import Icon, { ICON_COLORS } from './Icon'
import { summarizeDistrict } from '../utils/suitability'
import './extras.css'

function Stat({ icon, value, unit, label, tone }) {
  return (
    <div className={`stat ${tone ? `stat-${tone}` : ''}`}>
      <span className="stat-icon"><Icon name={icon} size={18} color={ICON_COLORS[icon]} /></span>
      <span className="stat-value">
        {value}
        {unit && <small>{unit}</small>}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

function DistrictDashboard({ title, data }) {
  const s = useMemo(() => summarizeDistrict(data), [data])

  return (
    <section className="dashboard">
      <div className="dashboard-head">
        <h3>{title}</h3>
        {s.level && (
          <span className="score-pill" style={{ '--c': s.level.color }} title="Average suitability of all zones">
            {s.avgScore} · {s.level.label}
          </span>
        )}
      </div>
      <div className="stat-grid">
        <Stat icon="forest" value={s.forestHectares} unit=" ha" label={`${s.forestCount} forest zones`} />
        <Stat
          icon="solar"
          value={s.avgSunDays ?? '—'}
          unit={s.avgSunDays ? ' d/yr' : ''}
          label={`${s.solarCount} solar zones`}
        />
        <Stat
          icon="water"
          value={s.waterCount}
          label={s.droughtHigh ? `${s.droughtHigh} high drought risk` : 'water sources'}
          tone={s.droughtHigh ? 'warn' : null}
        />
        <Stat
          icon="risk"
          value={s.riskCount}
          label={s.riskHigh ? `${s.riskHigh} high danger` : 'risk zones'}
          tone={s.riskHigh ? 'danger' : null}
        />
      </div>
    </section>
  )
}

export default DistrictDashboard
