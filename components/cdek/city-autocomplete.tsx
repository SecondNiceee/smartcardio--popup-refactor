"use client"

import { useState, useRef } from "react"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { CdekCity } from "./types"
import { log, logerr, logerr2, logwarn } from 'lib/utils'

export function CityAutocomplete({
  value,
  onSelect,
}: {
  value: string
  onSelect: (city: CdekCity) => void
}) {
  const [input, setInput] = useState(value)
  const [suggestions, setSuggestions] = useState<CdekCity[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleChange(val: string) {
    setInput(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (val.trim().length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }
    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/cdek/cities?name=${encodeURIComponent(val)}`)
        const data: CdekCity[] = await res.json()
        setSuggestions(Array.isArray(data) ? data.slice(0, 8) : [])
        setOpen(true)
      } catch (e) {
        logerr2("[cdek cities]", e)
      } finally {
        setLoading(false)
      }
    }, 350)
  }

  function handleSelect(city: CdekCity) {
    setInput(city.full_name)
    setSuggestions([])
    setOpen(false)
    onSelect(city)
  }

  return (
    <div className="relative">
      <Input
        id="cdek-city"
        autoComplete="off"
        placeholder="Начните вводить город..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
      />
      {loading && (
        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
      )}
      {open && suggestions.length > 0 && (
        <ul
          className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-border shadow-md"
          style={{ backgroundColor: "var(--popover, #fff)", color: "var(--popover-foreground, #000)" }}
        >
          {suggestions.map((c, i) => (
            <li key={i}>
              <button
                type="button"
                onMouseDown={() => handleSelect(c)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
              >
                {c.full_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
