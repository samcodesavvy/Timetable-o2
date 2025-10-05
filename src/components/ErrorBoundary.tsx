import React from 'react'

type State = { hasError: boolean }

export default class ErrorBoundary extends React.Component<{}, State> {
  constructor(props: {}){
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(){
    return { hasError: true }
  }

  componentDidCatch(error: any, info: any){
    // In a real app we'd log to monitoring here
    console.error('Uncaught error:', error, info)
  }

  render(){
    if(this.state.hasError){
      return (
        <div style={{padding:24, textAlign:'center'}}>
          <h2>Something went wrong.</h2>
          <p>Reload the app or check console for details.</p>
        </div>
      )
    }
    return this.props.children as React.ReactElement
  }
}
