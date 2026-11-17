import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  TreePine, Sun, Droplets, TriangleAlert, MapPin, MapPinned, MapPinPlus, Search, X, Phone, Trash2,
  Map, Satellite, Mountain, Layers, CircleCheck, Info, OctagonX, Lightbulb, Plus, Minus,
  ChevronDown, ChevronRight, StickyNote, Building2, House, Leaf, LocateFixed, ScanSearch, Sprout
} from 'lucide-react'

// One place that maps semantic names to vector icons
const ICONS = {
  forest: TreePine,
  solar: Sun,
  water: Droplets,
  risk: TriangleAlert,
  warning: TriangleAlert,
  pin: MapPin,
  district: MapPinned,
  city: Building2,
  village: House,
  addPin: MapPinPlus,
  search: Search,
  close: X,
  phone: Phone,
  trash: Trash2,
  map: Map,
  satellite: Satellite,
  terrain: Mountain,
  layers: Layers,
  success: CircleCheck,
  info: Info,
  error: OctagonX,
  tip: Lightbulb,
  plus: Plus,
  minus: Minus,
  down: ChevronDown,
  right: ChevronRight,
  note: StickyNote,
  logo: Leaf,
  locate: LocateFixed,
  scan: ScanSearch,
  sprout: Sprout
}

// Semantic colors, reused by the map markers, legend and panels
export const ICON_COLORS = {
  forest: '#16a34a',
  solar: '#f59e0b',
  water: '#3b82f6',
  risk: '#ef4444',
  warning: '#f59e0b',
  success: '#22c55e',
  error: '#ef4444',
  info: '#3b82f6',
  tip: '#16a34a',
  pin: '#3b82f6'
}

function Icon({ name, size = 18, color, strokeWidth = 2, className = '', ...rest }) {
  const Cmp = ICONS[name] || MapPin
  return (
    <Cmp
      size={size}
      strokeWidth={strokeWidth}
      color={color || 'currentColor'}
      className={`icon ${className}`}
      aria-hidden="true"
      {...rest}
    />
  )
}

/** Round badge with an icon, as HTML for Leaflet divIcon. */
export function markerHtml(name, color, size = 32) {
  const svg = renderToStaticMarkup(<Icon name={name} size={Math.round(size * 0.55)} color="#fff" />)
  return `<div class="map-pin" style="--c:${color};width:${size}px;height:${size}px">${svg}</div>`
}

export default Icon
