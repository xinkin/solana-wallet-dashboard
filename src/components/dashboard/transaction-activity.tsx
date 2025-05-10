'use client';

import { useTransactionHistory } from '@/hooks/useSolData';
import { useMemo } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import './transaction-activity.css';
import { subYears, format, differenceInDays, differenceInMonths } from 'date-fns';
import { Clock, Calendar, Grid, Activity } from 'lucide-react';

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
    <div className="p-8 bg-card rounded-xl border border-border shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-primary">Transaction Activity</h2>
        <span className="text-sm bg-primary/10 px-3 py-1 rounded-full text-primary font-medium">{yearRangeText}</span>
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

          <div className="grid grid-cols-3 gap-6 mt-8 mb-6 text-sm">
            <div className="bg-gradient-to-br from-card/80 to-card/50 p-4 rounded-lg border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-primary font-bold text-xl mb-1">{totalTransactions.toLocaleString()}</div>
              <div className="text-gray-400 flex items-center">
                <Activity className="h-4 w-4 mr-1 text-primary/70" />
                <span>Total Transactions</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-card/80 to-card/50 p-4 rounded-lg border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-primary font-bold text-xl mb-1">{dailyAvg}</div>
              <div className="text-gray-400 flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-primary/70" />
                <span>Daily Average</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-card/80 to-card/50 p-4 rounded-lg border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-primary font-bold text-xl mb-1">{monthlyAvg}</div>
              <div className="text-gray-400 flex items-center">
                <Grid className="h-4 w-4 mr-1 text-primary/70" />
                <span>Monthly Average</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4 text-sm">
            <div className="flex items-center space-x-2 bg-card/30 px-4 py-2 rounded-full shadow-inner">
              <span className="text-gray-400 font-medium">Less</span>
              <div className="w-4 h-4 bg-[#ebedf0] dark:bg-[#161b22] rounded-sm shadow-sm"></div>
              <div className="w-4 h-4 bg-[rgba(117,64,179,0.2)] dark:bg-[rgba(138,86,204,0.2)] rounded-sm shadow-sm"></div>
              <div className="w-4 h-4 bg-[rgba(117,64,179,0.4)] dark:bg-[rgba(138,86,204,0.4)] rounded-sm shadow-sm"></div>
              <div className="w-4 h-4 bg-[rgba(117,64,179,0.6)] dark:bg-[rgba(138,86,204,0.6)] rounded-sm shadow-sm"></div>
              <div className="w-4 h-4 bg-[rgba(117,64,179,0.8)] dark:bg-[rgba(138,86,204,0.8)] rounded-sm shadow-sm"></div>
              <div className="w-4 h-4 bg-[rgba(117,64,179,1)] dark:bg-[rgba(138,86,204,1)] rounded-sm shadow-sm"></div>
              <span className="text-gray-400 font-medium">More</span>
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
