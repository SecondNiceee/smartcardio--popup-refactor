"use client"

import { useEffect, useRef, useState } from "react"

type AnimationDirection = "left" | "right" | "bottom" | "top"

interface UseScrollAnimationOptions {
  direction?: AnimationDirection
  threshold?: number
  delay?: number
}

export function useScrollAnimation({
  direction = "bottom",
  threshold = 0.15,
  delay = 0,
}: UseScrollAnimationOptions = {}) {
  const ref = useRef<HTMLElement>(null)
  // Стартуем как "не анимировано". Анимацию включаем только после монтирования
  // на клиенте, чтобы серверный HTML (который видят боты и краулеры) всегда
  // содержал полностью видимый контент.
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [animationEnabled, setAnimationEnabled] = useState(false)

  useEffect(() => {
    // Уважаем настройку пользователя «уменьшить движение» — анимацию не запускаем
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      setIsVisible(true)
      setHasAnimated(true)
      return
    }

    setAnimationEnabled(true)
  }, [])

  useEffect(() => {
    const element = ref.current
    if (!element || hasAnimated || !animationEnabled) return

    const triggerVisible = () => {
      if (delay > 0) {
        setTimeout(() => {
          setIsVisible(true)
          setHasAnimated(true)
        }, delay)
      } else {
        setIsVisible(true)
        setHasAnimated(true)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          triggerVisible()
          observer.unobserve(element)
        }
      },
      {
        // threshold: 0 => срабатывает как только хоть один пиксель элемента
        // пересекает активную область. Это критично для секций, которые
        // выше вьюпорта: с большим threshold (напр. 0.15) высокая секция
        // никогда не наберёт нужный процент видимости и анимация не запустится.
        threshold: 0,
        // Запускаем чуть раньше, чем верх элемента полностью войдёт снизу.
        rootMargin: "0px 0px -10% 0px",
      }
    )

    observer.observe(element)

    // Если элемент уже в viewport в момент подключения observer — проверяем сразу
    const rect = element.getBoundingClientRect()
    const inView = rect.top < window.innerHeight && rect.bottom > 0
    if (inView) {
      triggerVisible()
      observer.unobserve(element)
    }

    return () => {
      observer.disconnect()
    }
  }, [delay, hasAnimated, animationEnabled])

  const getTransform = () => {
    switch (direction) {
      case "left":
        return "translateX(-80px)"
      case "right":
        return "translateX(80px)"
      case "top":
        return "translateY(-80px)"
      case "bottom":
      default:
        return "translateY(80px)"
    }
  }

  // Пока анимация не включена (серверный HTML, боты, отключённый JS,
  // prefers-reduced-motion) контент всегда полностью видим и без сдвига.
  const shouldHide = animationEnabled && !isVisible

  const style: React.CSSProperties = {
    opacity: shouldHide ? 0 : 1,
    transform: shouldHide ? getTransform() : "translate(0, 0)",
    transition: animationEnabled
      ? "opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      : undefined,
  }

  return { ref, style, isVisible }
}
