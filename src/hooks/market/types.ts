export interface MarketDataPoint {
  time: string;
  btc: number;
  eth: number;
  sp500: number;
}

export interface WebSocketMessage {
  s: string;  // symbol
  p: string;  // price
  E: number;  // event time
}

export interface MarketDataState {
  data: MarketDataPoint[];
  isLoading: boolean;
  error: string | null;
}