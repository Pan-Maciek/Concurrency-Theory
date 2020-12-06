import { binaryExponentialBackoff as beb } from './utils.js'

export default class Fork {
  static #lockedState = Symbol.for('locked')
  static #unlockedState = Symbol.for('unlocked')

  #state = Fork.#unlockedState

  get acquireable() {
    return this.#state === Fork.#unlockedState
  }

  tryAcquire() {
    if (this.acquireable) {
      this.#state = Fork.#lockedState
      return true
    } else return false
  }

  async acquire() {
    await beb(() => this.tryAcquire())
  }

  release() {
    this.#state = Fork.#unlockedState
  }

  static async acquireAll(...forks) {
    await beb(() => {
      const idx = forks.findIndex(fork => !fork.tryAcquire())
      if (idx >= 0) {
        for (let i = 0; i < idx; i++)
          forks[i].release()
        return false
      }
      return true
    })
  }
}
