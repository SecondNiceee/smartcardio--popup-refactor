"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Menu } from "lucide-react"
import { DownloadDialog } from "@/components/download-dialog"
import { CdekOrderDialog } from "@/components/cdek-order-dialog"

const navItems = [
  { label: "Как это работает", href: "#how" },
  { label: "Инструкция", href: "/pdf/smartcardio.pdf" },
  { label: "Контакты", href: "#contact" },
  { label: "СМИ о нас", href: "/pdf/press202606.pdf" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [orderOpen, setOrderOpen] = useState(false)

  const handleNav = (href: string) => {
    setOpen(false)
    // small delay so panel closes before scroll
    setTimeout(() => {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: "smooth" })
    }, 150)
  }

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white p-2 shadow-md">
            <Image
              loading="eager"
              src="/images/logo.jpg"
              alt="Логотип СмартКардио"
              width={40}
              height={40}
              className="h-full w-full object-contain"
              priority
            />
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">
            Смарт<span className="text-white/70">Кардио</span><sup className="text-xs">®</sup>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-9 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target={item.href.startsWith("/pdf/") ? "_blank" : undefined}
              rel={item.href.startsWith("/pdf/") ? "noopener noreferrer" : undefined}
              className="text-base font-medium text-white/80 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <DownloadDialog
            trigger={
              <button className="text-base font-medium text-white/80 transition-colors hover:text-white">
                Приложение
              </button>
            }
          />
        </nav>

        {/* Desktop CTA */}
        <CdekOrderDialog
          trigger={
            <button className="hidden md:inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-white/90">
              Заказать прибор
            </button>
          }
        />

        {/* Mobile burger */}
        <button
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex md:hidden items-center justify-center rounded-md p-2 text-white transition-colors hover:bg-white/10"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden absolute inset-x-0 top-full z-40 bg-black/90 backdrop-blur-md border-t border-white/10">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navItems.map((item) =>
              item.href.startsWith("/pdf/") ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="w-full px-3 py-3 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors block"
                >
                  {item.label}
                </a>
              ) : (
                <button
                  key={item.href}
                  onClick={() => handleNav(item.href)}
                  className="w-full text-left px-3 py-3 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  {item.label}
                </button>
              )
            )}
            <DownloadDialog
              trigger={
                <button className="w-full text-left px-3 py-3 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  Приложение
                </button>
              }
            />
            <div className="mt-2 pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  setOpen(false)
                  setOrderOpen(true)
                }}
                className="block w-full text-center rounded-md bg-white px-4 py-2.5 text-sm font-medium text-foreground shadow-sm hover:bg-white/90 transition-colors"
              >
                Заказать прибор
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Controlled order dialog (always mounted) */}
      <CdekOrderDialog open={orderOpen} onOpenChange={setOrderOpen} />
    </header>
  )
}
