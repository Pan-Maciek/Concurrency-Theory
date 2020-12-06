import Fork from './fork.js'
import { performance } from 'perf_hooks'

export default class Philosopher {
  /**
   * @param {Number} id 
   * @param {Fork[]} forks 
   */
  constructor(id, forks) {
    this.id = id
    this.left = forks[id % forks.length]
    this.right = forks[(id + 1) % forks.length]
  }

  async startNaive(count) {
    const { left, right } = this

    const start = performance.now()
    for (let i = 0; i < count; i++) {
      await left.acquire()
      await right.acquire()

      left.release()
      right.release()
    }
    return (performance.now() - start) / count
  }

  async startAsym(count) {
    const { left, right, id } = this
    const [first, second] = id % 2 == 0 ? [right, left] : [left, right]

    const start = performance.now()
    for (let i = 0; i < count; i++) {
      await first.acquire()
      await second.acquire()
      left.release()
      right.release()
    }
    return (performance.now() - start) / count
  }

  async startConductor(count, waiter) {
    const { left, right } = this

    const start = performance.now()
    for (let i = 0; i < count; i++) {
      await waiter.acquire()

      await left.acquire()
      await right.acquire()

      left.release()
      right.release()
      waiter.release()
    }
    return (performance.now() - start) / count
  }

  async startStarving(count) {
    const { left, right } = this

    const start = performance.now()
    for (let i = 0; i < count; i++) {
      await Fork.acquireAll(left, right)

      left.release()
      right.release()
    }
    return (performance.now() - start) / count
  }
}