import React, { useState } from 'react'
import Icon from './Icon'
import './extras.css'

const ITEMS = [
  { color: '#22c55e', shape: 'circle', label: 'Forest restoration zone' },
  { color: '#f59e0b', shape: 'icon', icon: 'solar', label: 'Solar energy zone' },
  { color: '#3b82f6', shape: 'icon', icon: 'water', label: 'Water: low drought risk' },
  { color: '#f97316', shape: 'icon', icon: 'water', label: 'Water: medium drought risk' },
  { color: '#ef4444', shape: 'icon', icon: 'water', label: 'Water: high drought risk' },
  { color: '#ef4444', shape: 'ring', label: 'Risk zone (~200 m)' },
  { color: '#3b82f6', shape: 'dashed', label: 'Your 100 m check radius' }
]

function Legend() {
  const [open, setOpen] = useState(() => typeof window === 'undefined' || window.innerWidth > 768)

  return (
    <div className={`legend ${open ? 'open' : ''}`}>
      <button className="legend-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="with-icon"><Icon name="layers" size={14} /> Legend</span>
        <span className="legend-chevron"><Icon name={open ? 'down' : 'right'} size={14} /></span>
      </button>
      {open && (
        <ul>
          {ITEMS.map((item) => (
            <li key={item.label}>
              <span className={`legend-swatch swatch-${item.shape}`} style={{ '--c': item.color }}>
                {item.icon && <Icon name={item.icon} size={14} color={item.color} />}
              </span>
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Legend
