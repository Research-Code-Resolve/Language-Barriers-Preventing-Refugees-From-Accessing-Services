const STORAGE_KEY = 'semasasa_scan_events';

export function logScanEvent() {
  const events = getScanEvents();
  events.push({ timestamp: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function getScanEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getScanStats() {
  const events = getScanEvents();
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;

  const today = events.filter(e => now - e.timestamp < oneDay).length;
  const thisWeek = events.filter(e => now - e.timestamp < oneWeek).length;
  const total = events.length;

  return { today, thisWeek, total };
}