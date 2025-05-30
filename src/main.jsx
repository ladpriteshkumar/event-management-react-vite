import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="671418339347-crc0dl6rii38b9k9l0ukdjcq91m0igok.apps.googleusercontent.com">
  <App />
</GoogleOAuthProvider>
  </StrictMode>,
)
