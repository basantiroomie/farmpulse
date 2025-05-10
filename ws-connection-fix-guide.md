# WebSocket Connection Fix Guide for FarmPulse

This guide explains the changes needed to fix the WebSocket connection issue in your FarmPulse application. Follow these steps in order.

## 1. Update the WebSocket URL in SensorDataMonitor

The main issue is that the WebSocket client is trying to connect to a URL that doesn't exist or is behind a different port.

In `/src/components/Dashboard/SensorDataMonitor.tsx`, replace this line:

```typescript
const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws?type=dashboard&animalId=${animalId}`;
```

with the direct backend URL:

```typescript
const wsUrl = `ws://localhost:3001?type=dashboard&animalId=${animalId}`;
```

## 2. Fix the Vite Config

If you want to use the proxy approach instead, make these changes to `/vite.config.ts`:

```typescript
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'ws://localhost:3001',
        ws: true
      }
    }
  },
  // (... rest of your config)
}));
```

## 3. Check Network Settings

Ensure that your firewall or network settings aren't blocking WebSocket connections, especially on port 3001.

## 4. Verify Backend WebSocket Server

Make sure your WebSocket server in `/src/backend/websocket/wsServer.js` is properly initializing and handling connections.

## 5. Debug with the Test Tool

Run the WebSocket test tool to diagnose connection issues:

```bash
npm run test:ws
```

This will help identify if the issue is with the frontend configuration or the backend server.

## 6. Additional Troubleshooting

If you're still having issues:

1. Try using a different port for the backend server
2. Check browser console for CORS errors
3. Test with a simple WebSocket client (like wscat)
4. Ensure all required dependencies are installed

By following these steps, you should be able to resolve the WebSocket connection issue in your FarmPulse application.
