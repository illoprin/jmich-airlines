function formatPrice(price: number, currency: string): string {
  if (currency !== "₽") {
    return currency + price.toLocaleString();
  }
  return price.toLocaleString() + currency;
}

export { formatPrice };