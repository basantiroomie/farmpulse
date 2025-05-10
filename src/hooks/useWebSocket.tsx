import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketOptions {
  url: string;
  onMessage?: (data: any) => void;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
}

interface WebSocketHook {
  connected: boolean;
  sendMessage: (data: any) => void;
  lastMessage: any;
  connectionError: string | null;
  reconnect: () => void;
}

export default function useWebSocket({
  url,
  onMessage,
  reconnectDelay = 5000,
  maxReconnectAttempts = 5
}: WebSocketOptions): WebSocketHook {
  const [connected, setConnected] = useState<boolean>(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const reconnectTimeoutRef = useRef<number | undefined>(undefined);
  const urlRef = useRef<string>(url);
  const isUnmountingRef = useRef<boolean>(false);
  
  // Function to establish connection
  const connectWebSocket = useCallback(() => {
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        console.log("WebSocket connection already open");
        return;
      }
      
      // If we're unmounting, don't try to connect
      if (isUnmountingRef.current) {
        return;
      }
      
      console.log(`Connecting to WebSocket: ${url}`);
      
      // Clean up any existing connection first
      if (wsRef.current) {
        try {
          wsRef.current.close(1000, "Creating new connection");
        } catch (e) {
          // Ignore errors on closing
        }
      }
      
      // Create new WebSocket connection
      wsRef.current = new WebSocket(url);
      
      wsRef.current.onopen = () => {
        console.log(`WebSocket connection established to ${url}`);
        setConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          
          // Call optional onMessage callback
          if (onMessage) {
            onMessage(data);
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };
      
      wsRef.current.onerror = (error) => {
        console.error(`WebSocket error with ${url}:`, error);
        setConnectionError(`Connection error to ${url.split('?')[0]}`);
      };
      
      wsRef.current.onclose = (event) => {
        console.log(`WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason || 'Unknown reason'}`);
        setConnected(false);
        
        // Don't attempt to reconnect if we're unmounting or the connection was closed intentionally
        if (isUnmountingRef.current || event.wasClean) {
          console.log("Clean close or unmounting, not attempting to reconnect");
          return;
        }
        
        // Attempt to reconnect if we haven't exceeded max attempts
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`);
          
          // Clear any existing timeout
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          // Set a new timeout for reconnection with exponential backoff
          const delay = reconnectDelay * Math.pow(1.5, reconnectAttemptsRef.current - 1);
          console.log(`Reconnecting in ${delay}ms`);
          
          reconnectTimeoutRef.current = window.setTimeout(() => {
            if (!isUnmountingRef.current) {
              connectWebSocket();
            }
          }, delay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setConnectionError(`Failed to connect after ${maxReconnectAttempts} attempts`);
        }
      };    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      setConnectionError("Failed to create connection");
    }
  }, [url, onMessage, reconnectDelay, maxReconnectAttempts]);
  
  // Function to send a message
  const sendMessage = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.error("Cannot send message, WebSocket not connected");
      setConnectionError("Not connected");
    }
  }, []);
  
  // Function to manually reconnect
  const reconnect = useCallback(() => {
    if (wsRef.current) {
      try {
        wsRef.current.close(1000, "Manual reconnection");
      } catch (e) {
        // Ignore errors on closing
      }
      wsRef.current = null;
    }
    
    // Reset reconnect attempts
    reconnectAttemptsRef.current = 0;
    
    // Clear any pending reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    // Connect again
    connectWebSocket();
  }, [connectWebSocket]);  // Connect on mount, disconnect on unmount
  useEffect(() => {
    // Store the URL to prevent unnecessary reconnections
    if (urlRef.current !== url) {
      urlRef.current = url;
      
      // Clean up existing connection before creating a new one for different URL
      if (wsRef.current) {
        try {
          wsRef.current.close(1000, "URL changed");
        } catch (e) {
          // Ignore errors on closing
        }
        wsRef.current = null;
      }
    }
    
    // Reset unmounting flag when mounting
    isUnmountingRef.current = false;
    
    // Only connect if we don't already have an active connection
    if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
      connectWebSocket();
    }
    
    // Cleanup on unmount
    return () => {
      console.log('Cleaning up WebSocket connection');
      isUnmountingRef.current = true;
      
      // Clear any pending reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      // Close the connection
      if (wsRef.current) {
        try {
          const tempWs = wsRef.current;
          wsRef.current = null;
          tempWs.close(1000, "Component unmounting");
        } catch (e) {
          console.error("Error closing WebSocket connection:", e);
        }
      }
    };
  }, [url, connectWebSocket]);
  
  return {
    connected,
    sendMessage,
    lastMessage,
    connectionError,
    reconnect
  };
}
