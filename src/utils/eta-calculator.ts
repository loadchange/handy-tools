export function formatMsDuration(duration: number): string {
  const ms = Math.floor(duration % 1000);
  const secs = Math.floor(((duration - ms) / 1000) % 60);
  const mins = Math.floor((((duration - ms) / 1000 - secs) / 60) % 60);
  const hrs = Math.floor((((duration - ms) / 1000 - secs) / 60 - mins) / 60);

  const parts = [];
  if (hrs > 0) parts.push(`${hrs} hours`);
  if (mins > 0) parts.push(`${mins} minutes`);
  if (secs > 0) parts.push(`${secs} seconds`);
  if (ms > 0) parts.push(`${ms} ms`);

  return parts.length > 0 ? parts.join(' ') : '0 seconds';
}

export function formatRelativeTime(targetDate: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((targetDate.getTime() - now.getTime()) / 1000);

  if (Math.abs(diffInSeconds) < 60) {
    return `${Math.abs(diffInSeconds)} seconds ${diffInSeconds >= 0 ? 'from now' : 'ago'}`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (Math.abs(diffInMinutes) < 60) {
    return `${Math.abs(diffInMinutes)} minutes ${diffInMinutes >= 0 ? 'from now' : 'ago'}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (Math.abs(diffInHours) < 24) {
    return `${Math.abs(diffInHours)} hours ${diffInHours >= 0 ? 'from now' : 'ago'}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${Math.abs(diffInDays)} days ${diffInDays >= 0 ? 'from now' : 'ago'}`;
}
