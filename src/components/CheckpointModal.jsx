import React, { useState } from 'react'
import './CheckpointModal.css'

function CheckpointModal({ onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState('note')
  const [note, setNote] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim()) {
      onSave({ title, type, note })
      setTitle('')
      setType('note')
      setNote('')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Add Checkpoint</h3>
        <form onSubmit={handleSubmit} className="checkpoint-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="form-input"
            >
              <option value="forest">🌱 Forest checkpoint</option>
              <option value="solar">☀️ Solar checkpoint</option>
              <option value="risk">⚠️ Risk checkpoint</option>
              <option value="note">📝 General note</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="3"
              className="form-input"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Save
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CheckpointModal

