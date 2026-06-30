// Проверка переменных окружения перед сборкой.
// Парсит .env.example, берёт все НЕзакомментированные ключи и убеждается,
// что каждый из них задан (непустым значением) в окружении / .env-файлах.
// Если хотя бы одна переменная отсутствует — прерывает сборку с ошибкой.
const fs = require("fs")
const path = require("path")

// Загружаем .env / .env.local / .env.production(.local) и т.п. в process.env,
// потому что Node сам по себе их не читает (только Next.js в рантайме).
try {
    const { loadEnvConfig } = require("@next/env")
    loadEnvConfig(process.cwd(), false)
} catch (err) {
    console.warn("[check-env] Не удалось загрузить env-файлы через @next/env:", err.message)
}

const examplePath = path.join(process.cwd(), ".env.example")

if (!fs.existsSync(examplePath)) {
    console.warn("[check-env] Файл .env.example не найден — пропускаю проверку.")
    process.exit(0)
}

const content = fs.readFileSync(examplePath, "utf8")

// Собираем имена обязательных переменных: строки вида KEY=...,
// игнорируя комментарии (#), пустые строки и необязательные переменные.
const requiredKeys = []
for (const rawLine of content.split("\n")) {
    const line = rawLine.trim()
    if (!line || line.startsWith("#")) continue
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=/)
    if (match && !requiredKeys.includes(match[1])) {
        requiredKeys.push(match[1])
    }
}

// Переменная считается отсутствующей, если она undefined или пустая строка.
const missing = requiredKeys.filter((key) => {
    const value = process.env[key]
    return value === undefined || value.trim() === ""
})

if (missing.length > 0) {
    console.error("\n\x1b[31m✖ Сборка прервана: не заданы обязательные переменные окружения\x1b[0m")
    console.error("\nОтсутствуют следующие переменные (см. .env.example):")
    for (const key of missing) {
        console.error(`  - ${key}`)
    }
    console.error("\nДобавьте их в .env и повторите сборку.\n")
    process.exit(1)
}

console.log(`[check-env] OK — все обязательные переменные заданы (${requiredKeys.length}).`)
