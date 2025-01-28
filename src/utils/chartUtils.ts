export const formatDate = (date: Date, period: "monthly" | "quarterly" | "yearly") => {
  switch (period) {
    case "monthly":
      return date.toLocaleString('default', { month: 'short', year: '2-digit' });
    case "quarterly":
      return `Q${Math.floor(date.getMonth() / 3) + 1} '${date.getFullYear().toString().slice(-2)}`;
    case "yearly":
      return date.getFullYear().toString();
  }
};

export const generateEmptyPeriods = (
  startDate: Date, 
  endDate: Date, 
  period: "monthly" | "quarterly" | "yearly"
) => {
  const periods = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    periods.push({
      period: formatDate(new Date(currentDate), period),
      volume: 0
    });

    switch (period) {
      case "monthly":
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      case "quarterly":
        currentDate.setMonth(currentDate.getMonth() + 3);
        break;
      case "yearly":
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        break;
    }
  }
  return periods;
};

export const calculateAverage = (data: any[]) => {
  if (!data.length) return 0;
  const sum = data.reduce((acc, curr) => acc + curr.volume, 0);
  return sum / data.length;
};