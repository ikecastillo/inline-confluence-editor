import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: string) => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: error.stack || 'No stack trace available'
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const errorMessage = errorInfo.componentStack || 'No component stack available';
    
    // Log error for debugging
    console.error('Inline Toolbar Error Boundary caught an error:', error);
    console.error('Error info:', errorMessage);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorMessage);
    }
    
    // In development, show more detailed error info
    if (process.env.NODE_ENV === 'development') {
      console.group('Error Boundary Details');
      console.error('Error:', error);
      console.error('Component Stack:', errorMessage);
      console.groupEnd();
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default fallback UI
      return (
        <div className="inline-toolbar-error" style={{
          position: 'absolute',
          zIndex: 50,
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          padding: '8px 12px',
          fontSize: '12px',
          color: '#856404',
          maxWidth: '200px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            Toolbar Error
          </div>
          <div style={{ fontSize: '11px' }}>
            The inline toolbar encountered an error. Please refresh the page.
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '8px', fontSize: '10px' }}>
              <summary style={{ cursor: 'pointer' }}>Debug Info</summary>
              <pre style={{ 
                marginTop: '4px', 
                padding: '4px', 
                backgroundColor: '#f8f9fa',
                borderRadius: '2px',
                overflow: 'auto',
                maxHeight: '100px'
              }}>
                {this.state.error?.message}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;