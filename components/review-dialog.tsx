"use client"

import { useState, type ReactNode, type FormEvent } from "react"
import { Star, Send } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ReviewDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [hovered, setHovered] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          serial: fd.get("serial"),
          date: fd.get("date"),
          email: fd.get("email"),
          text: fd.get("text"),
          rating,
        }),
      })
      if (!res.ok) throw new Error("Ошибка отправки")
      setSubmitted(true)
    } catch {
      setError("Не удалось отправить отзыв. Попробуйте позже.")
    } finally {
      setLoading(false)
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      // Reset after the close animation
      setTimeout(() => {
        setSubmitted(false)
        setRating(5)
        setHovered(0)
      }, 200)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      <DialogContent className="max-h-[90vh] overflow-y-scroll sm:max-w-lg">
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Send className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-xl">Спасибо за отзыв!</DialogTitle>
            <DialogDescription className="text-pretty">
              Ваш отзыв отправлен на модерацию. Мы ценим, что вы делитесь своим опытом.
            </DialogDescription>
            <Button className="mt-2" onClick={() => handleOpenChange(false)}>
              Закрыть
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl">Оставить свой отзыв</DialogTitle>
              <DialogDescription className="text-center">
                Поделитесь своим опытом использования СмартКардио®
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-5">
              {/* Stars */}
              <div className="flex flex-col items-center gap-2">
                <Label className="text-sm">Ваша оценка</Label>
                <div className="flex gap-1" role="radiogroup" aria-label="Оценка от 1 до 5">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const value = i + 1
                    const active = (hovered || rating) >= value
                    return (
                      <button
                        key={i}
                        type="button"
                        role="radio"
                        aria-checked={rating === value}
                        aria-label={`${value} из 5`}
                        onClick={() => setRating(value)}
                        onMouseEnter={() => setHovered(value)}
                        onMouseLeave={() => setHovered(0)}
                        className="rounded-full p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            active ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
                          }`}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Name (optional) */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="review-name">
                  Имя <span className="text-muted-foreground">(необязательно)</span>
                </Label>
                <Input id="review-name" name="name" placeholder="Анонимный отзыв" />
              </div>

              {/* Serial number */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="review-serial">
                  Серийный номер прибора <span className="text-destructive">*</span>
                </Label>
                <Input id="review-serial" name="serial" required placeholder="Например, SC-000123" />
              </div>

              {/* Purchase date */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="review-date">
                  Дата покупки <span className="text-destructive">*</span>
                </Label>
                <Input id="review-date" name="date" type="date" required />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="review-email">
                  Почта (не публикуется) <span className="text-destructive">*</span>
                </Label>
                <Input id="review-email" name="email" type="email" required placeholder="you@example.com" />
              </div>

              {/* Review text */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="review-text">
                  Ваш отзыв <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="review-text"
                  name="text"
                  required
                  rows={7}
                  placeholder="Расскажите о своём опыте использования прибора"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              <DialogFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Отправка..." : "Отправить отзыв"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
