import React from 'react'
import Icon, { ICON_COLORS } from './Icon'
import './extras.css'


function Toast({ toasts, onDismiss }) {
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span className="toast-icon"><Icon name={toast.type} size={20} color={ICON_COLORS[toast.type]} /></span>
          <div className="toast-body">
            <strong>{toast.title}</strong>
            {toast.message && <span>{toast.message}</span>}
          </div>
          <button className="toast-close" onClick={() => onDismiss(toast.id)} aria-label="Dismiss">
            <Icon name="close" size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default Toast
