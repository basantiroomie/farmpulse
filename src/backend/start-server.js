import cors from 'cors';
import server from './server.js';  // Import the default export

// Configure server to use CORS
server.use(cors());

const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});

export default server;