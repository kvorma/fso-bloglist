// Full Stack Open harjoitustyö
// Applikaation käynnistys

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './App'
import './index.css'

import { AuthProvider } from './contexts/authContext'
import { MsgProvider } from './contexts/messageContext'

// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <MsgProvider>
        <Router>
          <App />
        </Router>
      </MsgProvider>
    </AuthProvider>
  </QueryClientProvider>
)
