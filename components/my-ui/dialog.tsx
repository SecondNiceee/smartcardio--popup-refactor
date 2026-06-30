"use client"

import React, { useEffect, type ReactNode } from "react"
import { createPortal } from "react-dom"

type DialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  // Lock body scroll when open using the position:fixed technique, which
  // reliably blocks both wheel and touch scrolling across devices.
  useEffect(() => {
    if (!open) return

    const scrollY = window.scrollY
    const body = document.body
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    }

    body.style.position = "fixed"
    body.style.top = `-${scrollY}px`
    body.style.left = "0"
    body.style.right = "0"
    body.style.width = "100%"
    body.style.overflow = "hidden"

    return () => {
      body.style.position = prev.position
      body.style.top = prev.top
      body.style.left = prev.left
      body.style.right = prev.right
      body.style.width = prev.width
      body.style.overflow = prev.overflow
      window.scrollTo(0, scrollY)
    }
  }, [open])

  // Find trigger and content among children
  const childArray = React.Children.toArray(children)
  const trigger = childArray.find(
    (child) => React.isValidElement(child) && child.type === DialogTrigger
  )
  const content = childArray.find(
    (child) => React.isValidElement(child) && child.type === DialogContent
  )

  return (
    <>
      {/* Always render trigger */}
      {trigger}
      
      {/* Only render portal when open */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => onOpenChange(false)}
            />
            {/* Content */}
            {content}
          </div>,
          document.body
        )}
    </>
  )
}

type DialogContentProps = {
  children: ReactNode
  className?: string
}

export function DialogContent({ children, className = "" }: DialogContentProps) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  )
}

type DialogTriggerProps = {
  children: ReactNode
  onClick: () => void
  asChild?: boolean
}

export function DialogTrigger({ children, onClick, asChild }: DialogTriggerProps) {
  if (asChild) {
    // Clone child and add onClick
    const child = children as React.ReactElement
    return (
      <>
        {React.cloneElement(child, {
          onClick: (e: React.MouseEvent) => {
            onClick()
            child.props?.onClick?.(e)
          },
        })}
      </>
    )
  }

  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  )
}
