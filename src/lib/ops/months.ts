export function monthKeyFromDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function shiftMonth(key: string, offset: number) {
  const [year, month] = key.split("-").map(Number);
  return monthKeyFromDate(new Date(year, month - 1 + offset, 1));
}

export function pautaMonthOptions(selected = "") {
  const today = monthKeyFromDate(new Date());
  const keys: string[] = [];
  for (let offset = -2; offset <= 24; offset += 1) keys.push(shiftMonth(today, offset));
  if (/^\d{4}-\d{2}$/.test(selected) && !keys.includes(selected)) keys.push(selected);
  return keys.sort();
}
