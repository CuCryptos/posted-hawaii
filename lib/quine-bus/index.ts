/**
 * Minimal @quine/bus client vendored for POSTED HAWAI'I (Phase 1 pilot).
 *
 * Spec: https://github.com/Quine-Studio/quine-core/blob/main/bus-spec.md
 *
 * This is a hand-rolled subset — emit-only — until the canonical
 * `quine-bus/packages/bus-client` source is available to vendor wholesale.
 * Replace with the upstream client when accessible.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { EmitBuffer } from './buffer'
import { EventInput } from './types'
import type { EmitResult } from './types'

export type { EmitResult, EventInput, Severity } from './types'

export type BusOptions = {
  url: string
  key: string
  defaultSource?: string
}

export class Bus {
  private client: SupabaseClient
  private defaultSource?: string
  private buffer = new EmitBuffer()

  constructor(opts: BusOptions) {
    if (!opts.url) throw new Error('Bus: missing url')
    if (!opts.key) throw new Error('Bus: missing key')
    this.client = createClient(opts.url, opts.key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    this.defaultSource = opts.defaultSource
  }

  static fromEnv(defaultSource?: string): Bus {
    const url = process.env.QUINE_BUS_URL
    const key = process.env.QUINE_BUS_KEY
    if (!url || !key) {
      throw new Error(
        'Bus.fromEnv: QUINE_BUS_URL and QUINE_BUS_KEY must be set'
      )
    }
    return new Bus({ url, key, defaultSource })
  }

  async emit(input: Partial<EventInput> & { event_type: string }): Promise<EmitResult> {
    const merged = EventInput.parse({
      source: this.defaultSource,
      ...input,
    })

    const row = {
      event_type: merged.event_type,
      source: merged.source,
      severity: merged.severity,
      payload: merged.payload,
      correlation_id: merged.correlation_id ?? null,
      occurred_at: merged.occurred_at ?? new Date().toISOString(),
    }

    const { data, error } = await this.client
      .from('events')
      .insert(row)
      .select('id, event_type, occurred_at')
      .single()

    if (error) {
      this.buffer.add(merged)
      throw new Error(`Bus.emit failed: ${error.message}`)
    }

    return data as EmitResult
  }

  bufferedCount() {
    return this.buffer.size()
  }
}
