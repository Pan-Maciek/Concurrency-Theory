
export default class Conductor {
  #waiting = []
  #count = 0
  #capacity

  constructor(capacity) {
    this.#capacity = capacity
  }

  async acquire() {
    if (this.#count < this.#capacity) this.#count++
    else return new Promise(resolve => this.#waiting.push(resolve))
  }

  release() {
    if (this.#waiting.length > 0) this.#waiting.shift()()
    else this.#count--
  }
}