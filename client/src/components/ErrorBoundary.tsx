import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Acar Grup UI Error]:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#061528] flex items-center justify-center p-6 text-white text-center">
          <div className="max-w-md bg-[#0A2540] border border-white/10 p-8 rounded-[4px] shadow-2xl">
            <span className="inline-block text-3xl mb-3 text-[#FF6B00]">⚠</span>
            <h2 className="text-xl font-bold font-serif-heritage mb-2">Görünüm Yüklenirken Bir Hata Oluştu</h2>
            <p className="text-sm text-white/70 mb-6">
              {this.state.error?.message || 'Beklenmeyen bir arayüz hatası oluştu.'}
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-6 py-3 bg-[#FF6B00] text-white text-xs uppercase tracking-widest font-bold rounded-[2px] hover:bg-[#E55F00] transition-colors"
            >
              Sayfayı Yenile
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

