import axios from "axios";
import { env } from './environment'

export const api = axios.create({
  baseURL: env.backendUrl,
  headers: {
    "Access-Control-Allow-Origin": "*",
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
})

// Log de configuración en desarrollo
if (env.isDevelopment && env.debug) {
  console.log('🔧 API configurada en config/index.js con baseURL:', env.backendUrl)
}
