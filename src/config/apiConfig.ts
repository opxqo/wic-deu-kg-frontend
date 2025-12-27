/**
 * Centralized API Configuration
 * 
 * Logic:
 * - Development (npm run dev): Use empty string '' to let Vite Proxy handle the request.
 *   (Request -> /api/xxx -> localhost:3000/api/xxx -> Proxy -> localhost:8080/api/xxx)
 * 
 * - Production: Use absolute URL to direct backend.
 *   (Request -> https://zeabur-springboot.../api/xxx)
 */

// @ts-ignore
export const API_BASE_URL = import.meta.env.DEV
    ? ''
    : 'https://zeabur-springboot.168888868.xyz';
