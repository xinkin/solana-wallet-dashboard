'use client';

import { useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { format } from 'date-fns';

interface TransactionActivityProps {
  walletAddress?: string;
}

interface TransactionData {
  date: string;
  count: number;
}

export function TransactionActivity({ walletAddress }: TransactionActivityProps) {
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  
  // Sample data - would be replaced with actual transaction data from an API
  const [activityData] = useState<TransactionData[]>(() => {
    const data: TransactionData[] = [];
    const currentDate = new Date(oneYearAgo);
    
    while (currentDate <= today) {
      // Generate random transaction count (more likely to be 0 than have transactions)
      const random = Math.random();
      let count = 0;
      
      if (random > 0.7) {
        count = Math.floor(Math.random() * 10) + 1;
      }
      
      data.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        count
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return data;
  });

  const getClassForValue = (value: any) => {
    if (!value || value.count === 0) {
      return 'color-empty';
    }
    
    if (value.count < 3) {
      return 'color-scale-1';
    } else if (value.count < 6) {
      return 'color-scale-2';
    } else {
      return 'color-scale-3';
    }
  };

  return (
    <div className="p-6 bg-card rounded-lg border border-border">
      <h2 className="text-xl font-medium text-primary mb-6">Transaction Activity</h2>
      
      {walletAddress ? (
        <div>
          <CalendarHeatmap
            startDate={oneYearAgo}
            endDate={today}
            values={activityData}
            classForValue={getClassForValue}
            showWeekdayLabels={true}
            gutterSize={4}
          />
          <div className="flex justify-end mt-4 text-sm text-gray-400">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-sm bg-primary/20 mr-2"></div>
                <span>1-2 txns</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-sm bg-primary/50 mr-2"></div>
                <span>3-5 txns</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-sm bg-primary mr-2"></div>
                <span>6+ txns</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Connect your wallet to see your transaction activity</p>
        </div>
      )}
    </div>
  );
}
