const { random, floor, min } = Math

export const sum = values => values.reduce((acc, x) => acc + x, 0)
export const avg = values => sum(values) / values.length

export const sleep = time => new Promise(resolve => setTimeout(resolve, time))

/**
 * Perform binary exponential backoff at most maxRepeats times, 
 * with maximum delay time equal to maxDelay until test predicate returns true.
 * @param {()=>boolean} test Predicate determining whether to finish algorithm
 * @param {{maxRepeats:number, maxDelay:number}} config 
 * @returns number of tries
 */
export async function binaryExponentialBackoff(test, {
  maxRepeats = Number.POSITIVE_INFINITY,
  maxDelay = 1024
} = {}) {
  let range = 1
  for (let repeats = 0; repeats < maxRepeats; repeats++) {
    if (test()) return repeats
    const time = floor(random() * range)
    await sleep(time)
    range = min(range << 1, maxDelay)
  }
  throw new Error('binaryExponentialBackoff exceeded maximum number of tries')
}

