import React, { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import logger from './utils/logger'


interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false
  }

static getDerivedStateFromError(): State {
  return { hasError: true }
}




  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error(`Error capturado por ErrorBoundary: ${error.message}`)
    logger.debug(`Detalles: ${errorInfo.componentStack}`)
  }

  render() {
    if (this.state.hasError) {
      return <h2>Algo salió mal. Por favor, recarga la página.</h2>
    }

    return this.props.children
  }
}

export default ErrorBoundary
