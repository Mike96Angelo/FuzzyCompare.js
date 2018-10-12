/* Fuzzy Compare Threshold
 * @param needle     The search term.
 * @param haystack   The search space.
 * @param threshold  The threshold to pass.
 *
 * @returns True if the score is >= threshold
 */
export const fuzzyCompareThreshold = (
  needle: string,
  haystack: string,
  threshold: number = 0.5,
) => fuzzyCompare(needle, haystack) >= threshold

/* Fuzzy Compare
 * @param needle    The search term.
 * @param haystack  The search space.
 *
 * @returns A score between 0.0 and 1.0
 */
export const fuzzyCompare = (
  needle: string,
  haystack: string,
) => {
  // tslint:disable:no-parameter-reassignment
  needle = needle.toLowerCase()
  haystack = haystack.toLowerCase()
  // tslint:enable:no-parameter-reassignment

  const lenNeedle = needle.length
  const lenHaystack = haystack.length

  if (
    lenHaystack === 0
  ) {
    return 0
  }

  if (
    lenNeedle === 0 ||
    (lenNeedle === lenHaystack && needle === haystack)
  ) {
    return 1
  }

  const meanGoalNeedle = lenNeedle * (lenNeedle + 1) / 2
  const meanGoalHaystack = lenHaystack * (lenHaystack + 1) / 2

  let meanHitsNeedle = 0
  let meanHitsHaystack = 0

  let lastH = 0

  // tslint:disable-next-line:no-increment-decrement
  outer: for (let n = 0, h = 0; n < lenNeedle; n++) {
    const nch = needle.codePointAt(n)

    while (h < lenHaystack) {
      if (haystack.codePointAt(h) === nch) {
        // give earlier chars a higher weight
        meanHitsNeedle += lenNeedle - n
        meanHitsHaystack += lenHaystack - h

        // tslint:disable-next-line:no-increment-decrement
        h++
        lastH = h

        continue outer
      } else {
        // tslint:disable-next-line:no-increment-decrement
        h++
      }
    }

    h = lastH
  }

  return (meanHitsNeedle / meanGoalNeedle + meanHitsHaystack / meanGoalHaystack) / 2
}
