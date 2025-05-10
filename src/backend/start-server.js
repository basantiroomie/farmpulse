import { server } from './server.js';  // Import the server HTTP instance

const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
  console.log(`REST API available at http://localhost:${port}/api`);
  console.log(`WebSocket server available at ws://localhost:${port}`);
});

export { server };