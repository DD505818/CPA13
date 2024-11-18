import { useState, useEffect } from 'react';
import type { RiskMetrics } from '../services/trading/types';

export function useRiskMetrics() {
  const [metrics, setMetrics] = useState<RiskMetrics>({
    volatility: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
    winRate: 0
  });

  useEffect(() => {
    const calculateMetrics = () => {
      // Simulate real market volatility patterns
      const time = Date.now();
      const hour = new Date(time).getHours();
      
      // Higher volatility during market hours
      const baseVolatility = hour >= 9 && hour <= 16 ? 0.2 : 0.1;
      const volatility = baseVolatility + Math.sin(time / 10000) * 0.05;
      
      // Sharpe ratio inversely correlated with volatility
      const sharpeRatio = 2 - volatility + Math.random() * 0.2;
      
      // Max drawdown correlated with volatility
      const maxDrawdown = volatility * 0.6 + Math.random() * 0.05;
      
      // Win rate slightly mean-reverting
      const targetWinRate = 0.65;
      const currentWinRate = metrics.winRate || targetWinRate;
      const newWinRate = currentWinRate + (targetWinRate - currentWinRate) * 0.1 + (Math.random() - 0.5) * 0.05;

      setMetrics({
        volatility,
        sharpeRatio,
        maxDrawdown,
        winRate: Math.max(0, Math.min(1, newWinRate))
      });
    };

    calculateMetrics();
    const interval = setInterval(calculateMetrics, 2000);

    return () => clearInterval(interval);
  }, [metrics.winRate]);

  return metrics;
}