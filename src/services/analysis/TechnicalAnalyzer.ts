import { MarketData } from '../trading/types';
import type { BacktestResult, PerformanceMetrics, TechnicalIndicator } from './types';

export class TechnicalAnalyzer {
  private readonly fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];

  calculateIndicators(data: MarketData[]): TechnicalIndicator[] {
    if (!data.length) {
      throw new Error('No market data provided');
    }

    return [
      this.calculateRSI(data),
      this.calculateMACD(data),
      this.calculateBollingerBands(data)
    ];
  }

  calculateFibonacciLevels(high: number, low: number): number[] {
    if (high <= low) {
      throw new Error('High price must be greater than low price');
    }
    const diff = high - low;
    return this.fibLevels.map(level => low + diff * level);
  }

  findPivotPoints(data: MarketData[]): { support: number; resistance: number } {
    if (data.length < 3) {
      throw new Error('Insufficient data for pivot points calculation');
    }

    const prices = data.map(d => d.price);
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const close = prices[prices.length - 1];

    const pivot = (high + low + close) / 3;
    const support = 2 * pivot - high;
    const resistance = 2 * pivot - low;

    return { support, resistance };
  }

  calculateTeslaWaves(data: MarketData[]): {
    primaryWave: number;
    secondaryWave: number;
  } {
    if (data.length < 11) {
      throw new Error('Insufficient data for Tesla waves calculation');
    }

    const prices = data.map(d => d.price);
    const periods = [3, 7, 11];

    const waves = periods.map(period => {
      const slice = prices.slice(-period);
      return slice.reduce((a, b) => a + b, 0) / period;
    });

    return {
      primaryWave: waves[0],
      secondaryWave: waves[1]
    };
  }

  private calculateRSI(data: MarketData[], period: number = 14): TechnicalIndicator {
    if (data.length < period + 1) {
      throw new Error('Insufficient data for RSI calculation');
    }

    const changes = data.slice(1).map((d, i) => d.price - data[i].price);
    const gains = changes.map(c => c > 0 ? c : 0);
    const losses = changes.map(c => c < 0 ? -c : 0);

    const avgGain = gains.slice(-period).reduce((a, b) => a + b) / period;
    const avgLoss = losses.slice(-period).reduce((a, b) => a + b) / period;

    const rs = avgGain / (avgLoss || 1);
    const rsi = 100 - (100 / (1 + rs));

    return {
      name: 'RSI',
      value: rsi,
      signal: rsi > 70 ? 'sell' : rsi < 30 ? 'buy' : 'neutral',
      confidence: Math.abs(50 - rsi) / 50
    };
  }

  private calculateMACD(data: MarketData[]): TechnicalIndicator {
    if (data.length < 26) {
      throw new Error('Insufficient data for MACD calculation');
    }

    const prices = data.map(d => d.price);
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macd = ema12 - ema26;
    const signal = this.calculateEMA([macd], 9);

    const histogram = macd - signal;
    const confidence = Math.min(1, Math.abs(histogram) / prices[prices.length - 1] * 100);

    return {
      name: 'MACD',
      value: macd,
      signal: histogram > 0 ? 'buy' : histogram < 0 ? 'sell' : 'neutral',
      confidence
    };
  }

  private calculateBollingerBands(data: MarketData[]): TechnicalIndicator {
    if (data.length < 20) {
      throw new Error('Insufficient data for Bollinger Bands calculation');
    }

    const prices = data.map(d => d.price);
    const sma = prices.slice(-20).reduce((a, b) => a + b) / 20;
    const deviation = Math.sqrt(
      prices.slice(-20).reduce((a, b) => a + Math.pow(b - sma, 2), 0) / 20
    );

    const upperBand = sma + (2 * deviation);
    const lowerBand = sma - (2 * deviation);
    const currentPrice = prices[prices.length - 1];

    const percentB = (currentPrice - lowerBand) / (upperBand - lowerBand);
    const confidence = Math.min(1, Math.abs(0.5 - percentB));

    return {
      name: 'Bollinger Bands',
      value: percentB,
      signal: percentB > 1 ? 'sell' : percentB < 0 ? 'buy' : 'neutral',
      confidence
    };
  }

  private calculateEMA(data: number[], period: number): number {
    const k = 2 / (period + 1);
    return data.reduce((ema, price) => price * k + ema * (1 - k));
  }

  private calculateVolatility(prices: number[]): number {
    if (prices.length < 2) {
      throw new Error('Insufficient data for volatility calculation');
    }

    const returns = prices.slice(1).map((price, i) => 
      Math.log(price / prices[i])
    );
    
    const mean = returns.reduce((a, b) => a + b) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    
    return Math.sqrt(variance);
  }
}