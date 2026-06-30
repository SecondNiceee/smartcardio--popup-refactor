import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { log, logerr, logerr2, logwarn } from 'lib/utils'

export async function POST(req: Request) {
  try {
    const { name, phone, email, question } = await req.json()

    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT ?? 25)
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const to = process.env.QUESTION_EMAIL_TO
    const from = process.env.SMTP_FROM ?? (user ?? "noreply@smartcardio.ru")
    const fromName = process.env.SMTP_FROM_NAME ?? "СмартКардио сайт"

    if (!host || !to) {
      return NextResponse.json({ error: "SMTP env vars not configured" }, { status: 500 })
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

    const contact = phone ? `Телефон: ${phone}` : `Email: ${email}`

    const info = await transporter.sendMail({
      from: `"${fromName}" <${from}>`,
      to,
      subject: `Новый вопрос с сайта — ${name || "Аноним"}`,
      text: [
        `Новый вопрос с сайта СмартКардио`,
        ``,
        `Имя: ${name || "—"}`,
        contact,
        ``,
        `Вопрос: ${question || "—"}`,
      ].join("\n"),
      html: `
        <h2>Новый вопрос с сайта СмартКардио</h2>
        <p><b>Имя:</b> ${name || "—"}</p>
        <p><b>${phone ? "Телефон" : "Email"}:</b> ${phone || email || "—"}</p>
        <p><b>Вопрос:</b> ${question || "—"}</p>
      `,
    })

    log("[question] Mail sent OK: " + info.messageId + " " + info.response)

    return NextResponse.json({ ok: true })
  } catch (err) {
    logerr2("[question] Unhandled error:", err)
    return NextResponse.json(
      {
        error: "Failed to send question",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    )
  }
}
