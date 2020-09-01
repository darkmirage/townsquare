export function getInitials(name: string) {
  const parts = name.match(/\b\w/g) || [];
  const initials = ((parts.shift() || '') + (parts.pop() || '')).toUpperCase();
  return initials;
}

export function debounce(fn: Function, timeMs: number) {
  let timer: number | null = null;
  return () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(fn, timeMs);
  };
}
