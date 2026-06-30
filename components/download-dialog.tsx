"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {VideoDialog} from "@/components/video-dialog";

function AppStoreLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  )
}

function GooglePlayLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z" />
    </svg>
  )
}

function RuStoreLogo() {
  return (
      <svg width="88" height="88" version="1.1" viewBox="0 0 88 88" xmlns="http://www.w3.org/2000/svg">
          <path d="m42.2 88c-19.9 0-29.9 0-36.1-6.19-6.19-6.19-6.19-16.1-6.19-36.1l-1.6e-7 -3.52c-8.7e-7 -19.9-1.32e-6 -29.9 6.19-36.1 6.19-6.19 16.1-6.19 36.1-6.19h1e-4l3.52-1.5e-7c19.9-8.7e-7 29.9-1.29e-6 36.1 6.19 6.19 6.19 6.19 16.1 6.19 36.1v3.52c0 19.9 0 29.9-6.19 36.1s-16.1 6.19-36.1 6.19z" clipRule="evenodd" fill="#07f" fillRule="evenodd"/>
          <path d="m51.2 16.1c-2.3-0.0226-4.3 1.83-4.3 4.25v5.17l-10.8-2.69c-0.336-0.0838-0.671-0.126-1-0.129-2.3-0.0226-4.3 1.83-4.3 4.25v5.15l-10.7-2.67c-2.69-0.67-5.3 1.36-5.3 4.12v28.7c0 2.44 1.66 4.56 4.03 5.15l17.1 4.26c2.69 0.67 5.3-1.36 5.3-4.12v-28.7c0-1.75-0.857-3.33-2.21-4.3-0.0216-0.0707-0.0167-0.149 0.0273-0.213 0.075-0.109 0.21-0.161 0.336-0.123 2.25 0.68 4.39 2.98 4.61 5.88l0.742 21.9c0.0191 0.734 0.509 1.36 1.2 1.59l6 1.49c2.69 0.67 5.3-1.36 5.3-4.12 0.0708-9.47 0.0504-19.1 0.0528-28.6 0-1.29-0.436-2.28-0.926-3-0.0794-0.12-0.163-0.238-0.252-0.352-0.107-0.136-0.224-0.265-0.344-0.391-0.179-0.188-0.37-0.367-0.576-0.527-0.0014-0.0011-0.0025-0.0028-0.0039-0.0039-0.0848-0.0852-0.109-0.218-0.0391-0.318 0.075-0.109 0.21-0.161 0.336-0.123 2.25 0.68 4.4 2.98 4.61 5.88l0.742 21.9c0.019 0.728 0.504 1.35 1.19 1.57l6.01 1.5c2.69 0.67 5.3-1.36 5.3-4.12v-28.7c0-2.44-1.66-4.56-4.03-5.15l-17.1-4.26c-0.336-0.0838-0.671-0.126-1-0.129z" fill="#fff"/>
      </svg>
  )
}

function AppGalleryLogo() {
  return (
      <svg height="2500" viewBox="8.634 5.58835026 62.64 44.32264974" width="2500" xmlns="http://www.w3.org/2000/svg"><rect fill="#e14459" height="79.2" ry="17.058" width="79.2" x=".54" y=".412"/><path d="m19.846 5.59a2.253 2.245 0 0 0 -2.25 2.246 2.253 2.245 0 0 0 2.254 2.243 2.253 2.245 0 0 0 2.252-2.245v-.004a2.253 2.245 0 0 0 -2.256-2.241zm40.302 0a2.253 2.245 0 0 0 -2.25 2.246 2.253 2.245 0 0 0 2.255 2.243 2.253 2.245 0 0 0 2.252-2.245v-.004a2.253 2.245 0 0 0 -2.257-2.241z" fill="#c73148"/><path d="m19.757 7.525c-.783.042-.744 1.18-.744 1.18 4.209 8.196 11.957 12.215 20.893 12.216 8.924-.013 16.749-4.077 20.952-12.261 0 0 .166-1.541-1.474-1.007-4.31 7.144-11.55 11.37-19.473 11.383-7.937.002-15.152-4.18-19.47-11.337-.28-.135-.503-.184-.684-.174zm28.48 31.854-2.394 7.13-2.33-7.125h-2.275l3.672 10.366h1.771l2.4-6.809 2.396 6.809h1.786l3.665-10.365h-2.218l-2.335 7.125-2.394-7.13zm-12.716.003-4.645 10.361h2.183l.897-2.006.064-.151h4.826l.946 2.157h2.243l-4.603-10.3-.04-.061zm33.642 0v10.355h2.111v-10.354zm-60.529.002v10.369h2.14v-4.211h4.83v4.21h2.141v-10.367h-2.14v4.183h-4.83v-4.183zm19.014.003v5.935c0 1.685-.85 2.585-2.397 2.585-1.554 0-2.41-.925-2.41-2.657v-5.857h-2.141v5.929c0 2.917 1.65 4.589 4.523 4.589 2.9 0 4.563-1.704 4.563-4.675v-5.85zm31.006.004v10.354h7.963v-1.888h-5.853v-2.567h3.891v-1.89h-3.891v-2.12h5.65v-1.888zm-22.227 2.614 1.526 3.472.104.239h-3.237l.102-.239z" fill="#fff" strokeWidth="1.079"/></svg>
  )
}

type StoreItem = {
  name: string
  caption: string
  href: string
  tile?: string
  logo: ReactNode
  /** when true, the logo is a full-color image that already includes its own tile background */
  fullTile?: boolean
}

const stores: StoreItem[] = [
  {
    name: "TestFlight",
    caption: "Загрузить в",
    href: "/api/redirect?to=testflight",
    tile: "bg-gradient-to-br from-sky-500 to-blue-600",
    logo: <AppStoreLogo />,
  },
  {
    name: "Google Play",
    caption: "Доступно в",
    href: "/api/redirect?to=googleplay",
    tile: "bg-gradient-to-br from-emerald-500 to-green-600",
    logo: <GooglePlayLogo />,
  },
  {
    name: "RuStore",
    caption: "Установите из",
    href: "/api/redirect?to=rustore",
    logo: <RuStoreLogo />,
    fullTile: true,
  },
  {
    name: "AppGallery",
    caption: "Скачайте в",
    href: "/api/redirect?to=appgallery",
    logo: <AppGalleryLogo />,
    fullTile: true,
  },
]

export function DownloadDialog({ trigger }: { trigger: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Скачайте приложение СмартКардио®</DialogTitle>
          <DialogDescription className="text-center">
            Выберите магазин приложений для вашего устройства
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {stores.map((store) => (
            <a
              key={store.name}
              href={store.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/40 hover:bg-muted/60"
            >
              {store.fullTile ? (
                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                  {store.logo}
                </span>
              ) : (
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white ${store.tile}`}
                >
                  {store.logo}
                </span>
              )}
              <span className="flex flex-col leading-tight">
                <span className="text-xs text-muted-foreground">{store.caption}</span>
                <span className="font-semibold text-foreground">{store.name}</span>
              </span>
            </a>
          ))}
        </div>
        
        {/* Apple instruction button */}
        <div className="mt-4 border-t border-border pt-4">
            <a
                href="/videos/iphone_manual.mp4"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
            >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Инструкция для Apple (скачать подробное видео)
            </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}
