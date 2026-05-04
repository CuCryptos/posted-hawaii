import type { EventInput } from './types'

/**
 * In-memory buffer for emits that fail to reach the bus. Phase 1 keeps this
 * simple — events are flushed on next successful emit, or dropped on process
 * exit. Replace with the canonical buffer from quine-bus once that package is
 * published.
 */
export class EmitBuffer {
  private queue: EventInput[] = []

  add(event: EventInput) {
    this.queue.push(event)
  }

  drain(): EventInput[] {
    const out = this.queue
    this.queue = []
    return out
  }

  size() {
    return this.queue.length
  }
}
