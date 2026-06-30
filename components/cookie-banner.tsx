"use client"

import { useState, useEffect } from "react"

const STORAGE_KEY = "sc_cookieAccepted"

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem(STORAGE_KEY)
    if (!accepted) {
      setVisible(true)
    }
  }, [])

  function handleAccept() {
    localStorage.setItem(STORAGE_KEY, "1")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-5 right-5 z-[9999] w-72"
      role="dialog"
      aria-modal="true"
      aria-label="Уведомление об использовании cookie"
    >
      <div className="rounded-2xl bg-foreground text-background shadow-2xl overflow-hidden">
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium leading-relaxed text-balance">
              Мы используем файлы cookie, чтобы обеспечить максимальное удобство использования сайта.
            </p>
            <button
              onClick={handleAccept}
              aria-label="Закрыть"
              className="shrink-0 mt-0.5 opacity-50 hover:opacity-100"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="h-px bg-background/10 mx-5" />

        <div className="px-5 py-3">
          <button
            onClick={handleAccept}
            className="w-full rounded-xl bg-background text-foreground font-bold text-sm py-2.5 hover:opacity-90 active:scale-[0.98]"
          >
            Принимаю
          </button>
        </div>
      </div>
    </div>
  )
}