import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#fdfbf8',
            border: '1px solid #e8efe3',
            color: '#4d663b',
            fontSize: '14px',
            borderRadius: '12px',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
