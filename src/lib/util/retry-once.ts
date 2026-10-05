// Eén nieuwe poging bij tijdelijke storingen van de backend (502/503/504 of
// netwerkfout). Fouten met een andere HTTP-status (404, 400, ...) zijn geen
// storing en worden direct doorgegeven.
const RETRY_STATUSES = [502, 503, 504]

export const isTransientError = (error: unknown): boolean => {
  const status = (error as { status?: unknown } | null)?.status
  if (typeof status === "number") {
    return RETRY_STATUSES.includes(status)
  }
  // geen HTTP-status: netwerkfout, time-out of verbroken verbinding
  return true
}

export async function retryOnce<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (!isTransientError(error)) {
      throw error
    }
    return fn()
  }
}
