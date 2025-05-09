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
  reconnectDelay = 3000,
  maxReconnectAttempts = 5
}: WebSocketOptions): WebSocketHook {
  const [connected, setConnected] = useState<boolean>(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const reconnectTimeoutRef = useRef<number | undefined>(undefined);
  
  // Function to establish connection
  const connectWebSocket = useCallback(() => {
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        console.log("WebSocket connection already open");
        return;
      }
      
      console.log(`Connecting to WebSocket: ${url}`);
      
      // Create new WebSocket connection
      wsRef.current = new WebSocket(url);
      
      wsRef.current.onopen = () => {
        console.log("WebSocket connection established");
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
        console.error("WebSocket error:", error);
        setConnectionError("Connection error");
      };
      
      wsRef.current.onclose = (event) => {
        console.log(`WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`);
        setConnected(false);
        
        // Attempt to reconnect if not a clean close
        if (!event.wasClean && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`);
          
          reconnectTimeoutRef.current = window.setTimeout(() => {
            connectWebSocket();
          }, reconnectDelay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setConnectionError(`Failed to connect after ${maxReconnectAttempts} attempts`);
        }
      };
    } catch (error) {
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
      wsRef.current.close();
    }
    
    // Reset reconnect attempts
    reconnectAttemptsRef.current = 0;
    
    // Clear any pending reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    // Connect again
    connectWebSocket();
  }, [connectWebSocket]);
  
  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connectWebSocket();
    
    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connectWebSocket]);
  
  return {
    connected,
    sendMessage,
    lastMessage,
    connectionError,
    reconnect
  };
}
