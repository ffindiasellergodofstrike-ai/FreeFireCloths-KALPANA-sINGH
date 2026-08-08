import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans text-center">
          <div className="max-w-md bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
            <h1 className="text-2xl font-black mb-4 uppercase tracking-tight">Something went wrong</h1>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed">
              The application encountered an unexpected error. This might be due to an incompatible browser or a temporary failure.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-black text-white font-bold py-4 rounded-xl text-xs hover:bg-slate-800 transition-colors uppercase tracking-widest"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
