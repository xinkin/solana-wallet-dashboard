'use client';

import { useTransactionHistory } from '@/hooks/useSolData';
import { useMemo } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import './transaction-activity.css';
import { subYears, format, differenceInDays, differenceInMonths } from 'date-fns';

export function TransactionActivity({ walletAddress }: { walletAddress?: string }) {
  const { data: transactions, isLoading, error } = useTransactionHistory(walletAddress);

  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    const start = subYears(end, 1);
    return { startDate: start, endDate: end };
  }, []);

  const yearRangeText = useMemo(() => {
    const startYear = format(startDate, 'yyyy');
    const endYear = format(endDate, 'yyyy');
    return startYear === endYear ? startYear : `${startYear} - ${endYear}`;
  }, [startDate, endDate]);

  const maxCount = useMemo(() => {
    if (!transactions || transactions.length === 0) return 1;
    return Math.max(...transactions.map(d => d.count), 1);
  }, [transactions]);

  const { dailyAvg, monthlyAvg, totalTransactions } = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { dailyAvg: 0, monthlyAvg: 0, totalTransactions: 0 };
    }
    const total = transactions.reduce((sum, day) => sum + day.count, 0);

    const daysDiff = differenceInDays(endDate, startDate) || 1;
    const monthsDiff = differenceInMonths(endDate, startDate) || 1;

    return {
      dailyAvg: parseFloat((total / daysDiff).toFixed(1)),
      monthlyAvg: Math.round(total / monthsDiff),
      totalTransactions: total,
    };
  }, [transactions, startDate, endDate]);

  if (isLoading) {
    return (
      <div className="p-6 bg-card rounded-lg border border-border">
        <h2 className="text-xl font-medium text-primary mb-6">Transaction Activity</h2>
        <div className="animate-pulse h-40 bg-gray-700/20 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-card rounded-lg border border-border">
        <h2 className="text-xl font-medium text-primary mb-6">Transaction Activity</h2>
        <div className="text-red-500">Failed to load transaction activity</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-lg border border-border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-primary">Transaction Activity</h2>
        <span className="text-sm text-gray-400">{yearRangeText}</span>
      </div>

      {walletAddress ? (
        <div className="github-heatmap-container">
          <div className="heatmap-wrapper">
            <CalendarHeatmap
              startDate={startDate}
              endDate={endDate}
              values={transactions || []}
              classForValue={value => {
                if (!value) return 'color-empty';

                if (value.count === 1) return 'color-scale-1';

                const intensity = Math.min(Math.floor((value.count / maxCount) * 3) + 2, 5);
                return `color-scale-${intensity}`;
              }}
              titleForValue={value => {
                if (!value) return 'No transactions';

                const date = new Date(value.date);
                const day = date.getDate();
                const month = format(date, 'MMM');
                const year = format(date, 'yy');
                const ordinalSuffix = (day: number): string => {
                  if (day > 3 && day < 21) return 'th';
                  switch (day % 10) {
                    case 1:
                      return 'st';
                    case 2:
                      return 'nd';
                    case 3:
                      return 'rd';
                    default:
                      return 'th';
                  }
                };

                const formattedDate = `${day}${ordinalSuffix(day)} ${month} ${year}`;
                return `${formattedDate}: ${value.count} transactions`;
              }}
              showWeekdayLabels={true}
              showMonthLabels={true}
              gutterSize={4}
              horizontal={true}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 mb-4 text-sm">
            <div className="bg-card/50 p-3 rounded-md border border-border">
              <div className="text-primary font-medium">{totalTransactions}</div>
              <div className="text-gray-400">Total Transactions</div>
            </div>
            <div className="bg-card/50 p-3 rounded-md border border-border">
              <div className="text-primary font-medium">{dailyAvg}</div>
              <div className="text-gray-400">Daily Average</div>
            </div>
            <div className="bg-card/50 p-3 rounded-md border border-border">
              <div className="text-primary font-medium">{monthlyAvg}</div>
              <div className="text-gray-400">Monthly Average</div>
            </div>
          </div>

          <div className="flex justify-end mt-2 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <span>Less</span>
              <div className="w-3 h-3 bg-[#ebedf0] dark:bg-[#161b22] rounded-sm"></div>
              <div className="w-3 h-3 bg-[rgba(117,64,179,0.2)] dark:bg-[rgba(138,86,204,0.2)] rounded-sm"></div>
              <div className="w-3 h-3 bg-[rgba(117,64,179,0.4)] dark:bg-[rgba(138,86,204,0.4)] rounded-sm"></div>
              <div className="w-3 h-3 bg-[rgba(117,64,179,0.6)] dark:bg-[rgba(138,86,204,0.6)] rounded-sm"></div>
              <div className="w-3 h-3 bg-[rgba(117,64,179,0.8)] dark:bg-[rgba(138,86,204,0.8)] rounded-sm"></div>
              <div className="w-3 h-3 bg-[rgba(117,64,179,1)] dark:bg-[rgba(138,86,204,1)] rounded-sm"></div>
              <span>More</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-400">Connect your wallet to see your transaction activity</p>
        </div>
      )}
    </div>
  );
}
