
// This file is used to export the backend server
const express = require('express');
const server = require('./server');
const cors = require('cors');
const path = require('path');

// Configure server to use CORS
server.use(cors());

// Get port from environment or use 3001 as default
const port = process.env.PORT || 3001;

// Start the server when this file is imported
const startServer = () => {
  server.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
  });
};

// Start the server immediately
startServer();

// Export the server instance
module.exports = server;
