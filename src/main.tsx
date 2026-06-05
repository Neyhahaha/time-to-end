import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

class ErrorBoundary extends Component<{ children: React.ReactNode }, { error: string | null }> {
  state = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error: error.message + '\n' + error.stack }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 20, color: '#FF6B6B', fontFamily: 'monospace', fontSize: 13, whiteSpace: 'pre-wrap' }}>
          <h2 style={{ color: '#FF6B6B', marginBottom: 10 }}>渲染出错</h2>
          {this.state.error}
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
