// Cross-platform start script — works on Windows (cmd.exe) and Linux/macOS.
// Set HOST and PORT environment variables to override the defaults.
const { spawn } = require("child_process")

const mode = process.argv[2] === "dev" ? "dev" : "start"

// Load .env / .env.local / .env.development(.local) etc. into process.env,
// because Node does NOT read them automatically — only Next.js does at runtime.
// @next/env ships with Next, so no extra dependency is required.
try {
    const { loadEnvConfig } = require("@next/env")
    loadEnvConfig(process.cwd(), mode === "dev")
} catch (err) {
    console.warn("[start] Could not load env files via @next/env:", err.message)
}

// Resolve the Next.js binary explicitly so we can spawn it via Node directly,
// without relying on the shell to locate "next" — avoids shell injection risk.
const nextBin = require.resolve("next/dist/bin/next")

const child = spawn(
    process.execPath,
    [nextBin, mode, "--hostname", process.env.HOST, "--port", process.env.PORT],
    { stdio: "inherit" }
)

child.on("exit", (code) => {
    process.exit(code ?? 0)
})

// Forward SIG's to the child next-server process
const shutdown = (signal) => {
    if (child && !child.killed) {
        child.kill(signal)
    }
}

process.on("SIGTERM", () => shutdown("SIGTERM"))
process.on("SIGINT",  () => shutdown("SIGINT"))
process.on("SIGHUP",  () => shutdown("SIGHUP"))
