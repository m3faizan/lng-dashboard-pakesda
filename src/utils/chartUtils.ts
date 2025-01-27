export const timeframes = [
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "YTD", months: new Date().getMonth() },
  { label: "1Y", months: 12 },
  { label: "5Y", months: 60 },
  { label: "Max", months: 120 },
] as const;

export const formatChartDate = (date: Date): string => {
  return date.toLocaleString('default', { month: 'short', year: '2-digit' });
};

export const getStartDate = (months: number): Date => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  return startDate;
};