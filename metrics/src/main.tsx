import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TelemetryDashboard from './TelemetryDashboard'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TelemetryDashboard />
  </StrictMode>,
)
