import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResponsivePicture } from "@/components/responsive-picture"

export default function CongratulationPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16 text-center">
      {/* Background image — full width/height, darkened */}
      <div className="absolute inset-0">
        <ResponsivePicture
          src="/images/footerBg.png"
          alt=""
          fill
          fetchPriority="high"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-lg">
        <CheckCircle className="h-16 w-16 text-white" strokeWidth={1.5} />

        <h1 className="text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl">
          Заказ успешно оформлен!
        </h1>

        <p className="text-lg text-white/80 text-pretty leading-relaxed">
          Подробности заказа и информация о доставке отправлены на вашу электронную почту.
        </p>

        <Button asChild size="lg" className="mt-2">
          <Link href="/">На главную</Link>
        </Button>
      </div>
    </main>
  )
}
