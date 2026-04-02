import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ConfirmProvider } from '@confirmkit/react'

// Define custom presets to match the vanilla demo's "danger" preset
const customPresets = {
  danger: {
    styles: {
      container: { border: '2px solid #ef4444' },
      confirmButton: { background: '#dc2626', color: '#fff' },
      icon: { color: '#ef4444' }
    }
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfirmProvider presets={customPresets}>
      <App />
    </ConfirmProvider>
  </React.StrictMode>,
)
