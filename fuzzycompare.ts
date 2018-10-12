/* Fuzzy Compare
 * @param needle    The search term.
 * @param haystack  The search space.
 *
 * @returns A score between 0.0 and 1.0, higher score means better match.
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

  let meanHitsNeedle = 0
  let meanHitsHaystack = 0

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

        continue outer
      } else {
        // tslint:disable-next-line:no-increment-decrement
        h++
      }
    }
  }

  meanHitsNeedle /= lenNeedle
  meanHitsHaystack /= lenHaystack

  const meanGoalNeedle = (lenNeedle * (lenNeedle + 1) / 2) / lenNeedle
  const meanGoalHaystack = (lenHaystack * (lenHaystack + 1) / 2) / lenHaystack

  return (meanHitsNeedle / meanGoalNeedle + meanHitsHaystack / meanGoalHaystack) / 2
}
