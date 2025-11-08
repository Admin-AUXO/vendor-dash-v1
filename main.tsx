import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

// Signal that React is ready to render
const rootElement = document.getElementById('root')
if (rootElement) {
  try {
    // Add a data attribute to signal React is initializing
    rootElement.setAttribute('data-react-ready', 'false')
    
    const root = ReactDOM.createRoot(rootElement)
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
    
    // Signal that React has mounted
    // Use setTimeout to ensure React has fully initialized
    setTimeout(() => {
      rootElement.setAttribute('data-react-ready', 'true')
      // Dispatch custom event for initial loading screen to listen to
      window.dispatchEvent(new CustomEvent('react-ready'))
    }, 0)
  } catch (error) {
    console.error('Error initializing React:', error)
    // Fallback: show error or remove loading screen
    const initialScreen = document.getElementById('initial-loading-screen')
    if (initialScreen) {
      initialScreen.remove()
    }
  }
}

