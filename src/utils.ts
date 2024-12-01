const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

export function prettyNumber(number: number | undefined) {
  if (typeof number === "undefined") {
    return "";
  }
  return NUMBER_FORMATTER.format(number);
}
