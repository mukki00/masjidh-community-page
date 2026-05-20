import { Logger } from "next-axiom"
import type { NextRequest } from "next/server"

/**
 * Shared structured log fields attached to every log entry.
 */
export interface LogContext {
  route: string
  method: string
  user?: string | null
  role?: string | null
  ip?: string | null
}

/**
 * Create a logger scoped to a specific API route request.
 * Automatically attaches route, method, user IP, and any provided user context.
 *
 * Usage:
 *   const log = createRouteLogger(req, "/api/families")
 *   log.info("fetched families", { count: 12 })
 *   log.error("db failure", { error: err.message })
 */
export function createRouteLogger(
  req: NextRequest,
  route: string,
  userContext?: { username?: string | null; role?: string | null }
) {
  const log = new Logger()
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    null

  const baseFields: LogContext = {
    route,
    method: req.method,
    user: userContext?.username ?? null,
    role: userContext?.role ?? null,
    ip,
  }

  return {
    info(message: string, fields?: Record<string, unknown>) {
      log.info(message, { ...baseFields, ...fields })
    },
    warn(message: string, fields?: Record<string, unknown>) {
      log.warn(message, { ...baseFields, ...fields })
    },
    error(message: string, fields?: Record<string, unknown>) {
      log.error(message, { ...baseFields, ...fields })
    },
    /** Call this at the end of a request so Axiom flushes the batch */
    flush() {
      return log.flush()
    },
  }
}

/**
 * Convenience helper: record duration_ms from a start timestamp.
 * Pass the result of `Date.now()` captured at the top of the handler.
 */
export function elapsed(startedAt: number) {
  return { duration_ms: Date.now() - startedAt }
}
