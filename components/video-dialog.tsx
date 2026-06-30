"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/my-ui/dialog"

type VideoDialogProps = {
  trigger: ReactNode
  src: string
  title?: string
}

export function VideoDialog({ trigger, src, title = "Видео" }: VideoDialogProps) {
  const [open, setOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Auto-play when dialog opens, pause/reset when it closes
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (open) {
      video.currentTime = 0
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay may be blocked; the user can press play manually.
        })
      }
    } else {
      video.pause()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger onClick={() => setOpen(true)} asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="p-4 md:p-8">
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          aria-label="Закрыть видео"
          className="absolute right-4 top-4 z-30 flex cursor-pointer items-center gap-2.5 rounded-full bg-white/10 px-5 py-3 text-base font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:right-6 md:top-6 md:px-6 md:py-3.5 md:text-lg"
        >
          <svg
            className="h-6 w-6 md:h-7 md:w-7"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="hidden sm:inline">Закрыть</span>
        </button>

        {/* Video player */}
        <div className="flex h-full w-full items-center justify-center">
          <video
            ref={videoRef}
            src={src}
            controls
            playsInline
            className="max-h-[85vh] w-auto max-w-[95vw] rounded-xl shadow-2xl"
          >
            <track kind="captions" />
            {title}
          </video>
        </div>
      </DialogContent>
    </Dialog>
  )
}
