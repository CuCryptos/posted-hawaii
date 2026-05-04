import { z } from 'zod'

export const Severity = z.enum(['debug', 'info', 'warn', 'error'])
export type Severity = z.infer<typeof Severity>

export const EventInput = z.object({
  event_type: z.string().min(1),
  source: z.string().min(1),
  severity: Severity.default('info'),
  payload: z.record(z.unknown()).default({}),
  correlation_id: z.string().uuid().optional(),
  occurred_at: z.string().datetime().optional(),
})
export type EventInput = z.infer<typeof EventInput>

export type EmitResult = {
  id: string
  event_type: string
  occurred_at: string
}
