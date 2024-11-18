import { useState, useEffect, useRef, useCallback } from 'react';
import type { MarketDataPoint, WebSocketMessage } from './market/types';

export function useMarketData(timeframe: string) {
  const [data, setData] = useState<MarketDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);
  const retryCountRef = useRef(0);

  const MAX_DATA_POINTS = 100;
  const RECONNECT_DELAY = 5000;
  const MAX_RETRY_ATTEMPTS = 5;
  const UPDATE_THROTTLE = 1000;
  const SP500_UPDATE_INTERVAL = 5000;

  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    if (!mountedRef.current) return;

    setData(prevData => {
      const lastPoint = prevData[prevData.length - 1];
      if (!lastPoint) return prevData;

      const newPoint: MarketDataPoint = {
        time: new Date().toLocaleTimeString(),
        btc: message.s === 'BTCUSDT' ? parseFloat(message.p) : lastPoint.btc,
        eth: message.s === 'ETHUSDT' ? parseFloat(message.p) : lastPoint.eth,
        sp500: lastPoint.sp500
      };

      const newData = [...prevData, newPoint];
      return newData.slice(-MAX_DATA_POINTS);
    });
  }, []);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN || retryCountRef.current >= MAX_RETRY_ATTEMPTS) {
      return;
    }

    try {
      wsRef.current = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade/ethusdt@trade');

      let lastUpdateTime = Date.now();

      wsRef.current.onmessage = (event) => {
        if (!mountedRef.current) return;
        
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          const now = Date.now();

          if (now - lastUpdateTime < UPDATE_THROTTLE) return;
          lastUpdateTime = now;

          handleWebSocketMessage(message);
          retryCountRef.current = 0;
        } catch (error) {
          console.error('WebSocket message parsing failed:', error);
        }
      };

      wsRef.current.onerror = () => {
        if (mountedRef.current) {
          setError('Failed to connect to market data stream');
          retryCountRef.current++;
        }
      };

      wsRef.current.onclose = () => {
        if (mountedRef.current && retryCountRef.current < MAX_RETRY_ATTEMPTS) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, RECONNECT_DELAY);
          retryCountRef.current++;
        }
      };

      wsRef.current.onopen = () => {
        if (mountedRef.current) {
          setError(null);
          retryCountRef.current = 0;
        }
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      if (mountedRef.current) {
        setError('Failed to establish market data connection');
        retryCountRef.current++;
      }
    }
  }, [handleWebSocketMessage]);

  const fetchInitialData = useCallback(async () => {
    try {
      const response = await fetch(
        'https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT"]'
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!mountedRef.current) return;
      
      if (!Array.isArray(data) || data.length < 2) {
        throw new Error('Invalid data format received');
      }

      const initialPoint: MarketDataPoint = {
        time: new Date().toLocaleTimeString(),
        btc: parseFloat(data[0].lastPrice) || 0,
        eth: parseFloat(data[1].lastPrice) || 0,
        sp500: 4800 + Math.random() * 50
      };

      if (isNaN(initialPoint.btc) || isNaN(initialPoint.eth)) {
        throw new Error('Invalid price data received');
      }

      setData([initialPoint]);
      setIsLoading(false);
      setError(null);
    } catch (error) {
      if (mountedRef.current) {
        setError('Failed to fetch initial market data');
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    connectWebSocket();
    fetchInitialData();

    let lastSP500Update = Date.now();
    const sp500Interval = setInterval(() => {
      if (!mountedRef.current || Date.now() - lastSP500Update < SP500_UPDATE_INTERVAL) {
        return;
      }

      lastSP500Update = Date.now();
      setData(prevData => {
        const lastPoint = prevData[prevData.length - 1];
        if (!lastPoint) return prevData;

        const change = (Math.random() - 0.5) * 2;
        const newSP500 = lastPoint.sp500 + change;

        if (isNaN(newSP500)) return prevData;

        return prevData.map((point, index) => 
          index === prevData.length - 1 
            ? { ...point, sp500: newSP500 }
            : point
        );
      });
    }, 1000);

    return () => {
      mountedRef.current = false;
      clearInterval(sp500Interval);
      clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [timeframe, connectWebSocket, fetchInitialData]);

  return { data, isLoading, error };
}