export function convertIntegerToText(integer, fixed = 1) {
  const value = Math.abs(Number(integer));

  switch (true) {
    case value >= 1.0e+9: {
      const num = numberByDigits(value / 1.0e+9, fixed);
      return `${ num } млрд.`;
    }
    case value >= 1.0e+6: {
      const num = numberByDigits(value / 1.0e+6, fixed);
      return `${ num } млн.`;
    }
    default:
      return value.toLocaleString();
  }
}

export function numberByDigits(num, fixed = 1) {
  return num
    .toFixed(fixed)
    .toLocaleString()
    .replace('.', ',');
}
