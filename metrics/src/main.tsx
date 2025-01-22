import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TelemetryDashboard from './TelemetryDashboard.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TelemetryDashboard />
  </StrictMode>,
)
