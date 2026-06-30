import { log, logerr, logwarn } from 'lib/utils';

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    log(`[server] Next.js запущен HOST=${process.env.HOST} PORT=${process.env.PORT}`)
    const { startTokenRefreshLoop } = await import("./lib/cdek-token")
    startTokenRefreshLoop()
  }
}
