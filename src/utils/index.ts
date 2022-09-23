/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Build exact url to resource in public folder
 * @param pathToPublicResource The path to the resource in public folder
 * @returns A string represents an url to resource
 */
export function buildPathToPublicResource(pathToPublicResource: string): string {
  if (pathToPublicResource[0] === '/') pathToPublicResource = pathToPublicResource.slice(1);
  return `${process.env.BASE_PATH ?? ''}/${pathToPublicResource}`;
}

export function setRef<T>(
  ref: React.MutableRefObject<T | null> | ((instance: T | null) => void) | null | undefined,
  value: T | null
): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

/**
 * Check if a value is numeric or not
 */
export function isNumeric(value: any): value is number | string {
  return !isNaN(value) && !isNaN(parseFloat(value));
}

export function numberWithDelimiter(x: string | number, delimiter = ','): string {
  if (!isNumeric(x)) {
    throw new Error('Must provide a correct number');
  }
  const [natural, decimal] = x.toString().split('.');
  let out = natural.replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);
  if (decimal) {
    out += '.' + decimal;
  }
  return out;
}

export interface FormatNumberOptions<F> {
  /**
   * Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
   */
  fractionDigits?: number;
  /**
   * A fallback react tree to show when a number is invalid.
   * @default N/A
   */
  fallback?: F;
  /**
   * The string used to separate number.
   */
  delimiter?: string;
  /**
   * Allow zero after decimal point.
   * @default false
   */
  padZero?: boolean;
  /**
   * A string that will be appended to the beginning of the returned result.
   */
  prefix?: string;
  /**
   * A string that will be appended to the ending of the returned result.
   */
  suffix?: string;
}
/**
 * Format a number to easy-to-see
 * @param {*} number - The number needs to format
 * @param {FormatNumberOptions} options - Includes options to customize the results returned
 * @returns A string representing a number in formatted, `option.fallback` will be returned if `number` is invalid
 */
export function formatNumber<F = any>(number: any, options?: FormatNumberOptions<F>): string | F {
  const { fallback = 'N/A', fractionDigits, delimiter, padZero, prefix = '', suffix = '' } = options ?? {};
  if (!isNumeric(number)) {
    return fallback;
  }
  let n = String(number);
  if (isNumeric(fractionDigits)) {
    n = Number(n).toFixed(fractionDigits);
  }
  if (!padZero && n.split('.').length > 1) {
    n = n.replace(/0*$/g, ''); // remove last zeros after decimal point
  }
  return prefix + numberWithDelimiter(n, delimiter) + suffix;
}

/**
 * Compact large number
 * @param {*} n The number
 * @param {Number} fractionDigits Number of digits after the decimal point
 * @returns A compacted number in `K`, `M`, `B` or `T`.
 */
export function compactNumber(n: any, fractionDigits = 1) {
  if (!isNumeric(n)) {
    throw new Error('Must provide a correct number');
  }
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  let suffixNum = Math.floor((n.toString().split('.')[0].length - 1) / 3);

  if (suffixNum >= suffixes.length) {
    suffixNum = suffixes.length - 1;
  }

  let shortValue = (Number(n) / Math.pow(1000, suffixNum)).toFixed(fractionDigits + 2);

  if (Number(shortValue) % 1 !== 0) {
    shortValue = Number(shortValue).toFixed(fractionDigits);
  }

  return Number(shortValue).toString() + suffixes[suffixNum];
}
