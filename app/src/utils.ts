export function getInitials(name: string) {
  const parts = name.match(/\b\w/g) || [];
  const initials = ((parts.shift() || '') + (parts.pop() || '')).toUpperCase();
  return initials;
}
