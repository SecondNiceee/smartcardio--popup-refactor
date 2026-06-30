import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  const { name, phone, email, city, comment } = await req.json()

  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT ?? 25)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const to = process.env.REVIEW_EMAIL_TO
  const from = process.env.SMTP_FROM ?? (user ?? "noreply@smartcardio.ru")

  if (!host || !to) {
    return NextResponse.json({ error: "SMTP не настроен" }, { status: 500 })
  }

  // SMTP_SECURE: "true" = всегда SSL (порт 465), "false" или не задано при порте != 465 = без SSL/TLS
  const secure =
    process.env.SMTP_SECURE === "true" ? true
    : process.env.SMTP_SECURE === "false" ? false
    : port === 465

  // Если соединение не зашифровано — полностью запрещаем STARTTLS-апгрейд
  const ignoreTLS = !secure
  const requireTLS = false

  const auth = user && pass ? { user, pass } : undefined

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth,
    ignoreTLS,
    requireTLS,
  })

  await transporter.sendMail({
    from: `"СмартКардио сайт" <${from}>`,
    to,
    subject: `Нет ПВЗ в районе — запрос от ${name || "Покупатель"}`,
    text: [
      "Покупатель не нашёл ПВЗ СДЭК в своём районе.",
      "",
      `Имя: ${name || "—"}`,
      `Телефон: ${phone || "—"}`,
      `Email: ${email || "—"}`,
      `Город: ${city || "—"}`,
      `Комментарий: ${comment || "—"}`,
    ].join("\n"),
    html: `
      <h2>Запрос: нет ПВЗ в районе</h2>
      <p>Покупатель не нашёл подходящий пункт выдачи СДЭК.</p>
      <table style="border-collapse:collapse">
        <tr><td style="padding:4px 12px 4px 0"><b>Имя:</b></td><td>${name || "—"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0"><b>Телефон:</b></td><td>${phone || "—"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0"><b>Email:</b></td><td>${email || "—"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0"><b>Город:</b></td><td>${city || "—"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0"><b>Комментарий:</b></td><td>${comment || "—"}</td></tr>
      </table>
    `,
  })

  return NextResponse.json({ ok: true })
}
