export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase());
}

export function isRequired(value) {
  return value != null && String(value).trim() !== "";
}

