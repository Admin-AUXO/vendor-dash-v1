import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

// Signal that React is ready to render
const rootElement = document.getElementById('root')
if (rootElement) {
  // Add a data attribute to signal React is initializing
  rootElement.setAttribute('data-react-ready', 'false')
  
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  
  // Signal that React has mounted
  requestAnimationFrame(() => {
    rootElement.setAttribute('data-react-ready', 'true')
    // Dispatch custom event for initial loading screen to listen to
    window.dispatchEvent(new CustomEvent('react-ready'))
  })
}

