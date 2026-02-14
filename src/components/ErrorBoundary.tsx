import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: 16,
          margin: 16,
          background: '#1a1a2e',
          color: '#ff4444',
          borderRadius: 8,
          fontSize: '0.78rem',
          fontFamily: 'monospace',
          wordBreak: 'break-all',
        }}>
          <div style={{ color: '#ff0', fontWeight: 700, marginBottom: 8 }}>
            React Error Caught
          </div>
          <div>{this.state.error.message}</div>
          <div style={{ color: '#888', marginTop: 8, fontSize: '0.7rem' }}>
            {this.state.error.stack}
          </div>
          <button
            onClick={() => this.setState({ error: null })}
            style={{
              marginTop: 12,
              padding: '8px 16px',
              background: '#8b5e3c',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: '0.85rem',
            }}
          >
            リセット
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
