export const getDaysDiff = (start: Date, end: Date) => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((end.getTime() - start.getTime()) / oneDay);
};

export const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

export function generateTimelineMonths(now = new Date(), monthsBefore = 1, monthsAfter = 4) {
  const months = [];
  const start = new Date(now.getFullYear(), now.getMonth() - monthsBefore, 1);
  const iter = new Date(start);
  
  for (let i = 0; i < monthsBefore + monthsAfter + 1; i++) {
    const year = iter.getFullYear();
    const month = iter.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    
    months.push({
      year,
      month,
      days: Array.from({ length: days }, (_, i) => i + 1),
    });
    iter.setMonth(month + 1);
  }
  return months;
}