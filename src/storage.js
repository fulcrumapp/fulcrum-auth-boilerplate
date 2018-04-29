export function set(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function get(key) {
  const value = window.localStorage.getItem(key);

  return JSON.parse(value);
}

export function unset(key) {
  window.localStorage.removeItem(key);
}
