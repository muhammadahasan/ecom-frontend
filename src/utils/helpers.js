export function formatCurrency(value, currency = "USD", locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

export function classNames(...values) {
  return values.filter(Boolean).join(" ");
}
