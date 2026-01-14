import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Update title dynamically if not done in index.html
document.title = "AzoAI Panel | Smart Bot Admin";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 bg-red-50 text-red-900 h-screen overflow-auto">
          <h1 className="text-3xl font-bold mb-4">CRITICAL ERROR (White Screen)</h1>
          <p className="mb-4">Please take a screenshot of this page and send it to the developer.</p>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-red-200">
            <h2 className="text-xl font-mono font-bold mb-2">{this.state.error && this.state.error.toString()}</h2>
            <details className="whitespace-pre-wrap font-mono text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
