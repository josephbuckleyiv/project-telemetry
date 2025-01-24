import './App.css';

// Components
import { TimeGraph, Meter } from './components'

function TelemetryDashboard() {
    const test = async () => {
            fetch("http://localhost:5000/post")
            console.log("hi")
    }

  return (
      <>
          <div className="container text-center py-3">
              <div className="row">
                  <div className="col gap-1 d-flex flex-column">
                      <Meter />
                      <Meter />
                  </div>
                  <div className="col-9">
                      <TimeGraph />
                  </div>
                 
              </div>
          </div>
          <button type="button" className="btn btn-secondary" onClick={test}> Press to end world hunger</button>
          
    </>
  )
}

export default TelemetryDashboard
