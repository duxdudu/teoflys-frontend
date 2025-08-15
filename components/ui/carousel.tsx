"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const CarouselContext = React.createContext<{
  currentSlide: number
  totalSlides: number
  goToSlide: (index: number) => void
  nextSlide: () => void
  prevSlide: () => void
} | null>(null)

const useCarousel = () => {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a Carousel")
  }
  return context
}

interface CarouselProps {
  children: React.ReactNode
  className?: string
  autoPlay?: boolean
  interval?: number
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ children, className, autoPlay = false, interval = 5000 }, ref) => {
    const [currentSlide, setCurrentSlide] = React.useState(0)
    const [totalSlides, setTotalSlides] = React.useState(0)
    const containerRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      if (containerRef.current) {
        const slides = containerRef.current.children
        setTotalSlides(slides.length)
      }
    }, [children])

    const goToSlide = React.useCallback((index: number) => {
      setCurrentSlide(index)
    }, [])

    const nextSlide = React.useCallback(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, [totalSlides])

    const prevSlide = React.useCallback(() => {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
    }, [totalSlides])

    React.useEffect(() => {
      if (!autoPlay) return

      const timer = setInterval(() => {
        nextSlide()
      }, interval)

      return () => clearInterval(timer)
    }, [autoPlay, interval, nextSlide])

    return (
      <CarouselContext.Provider
        value={{
          currentSlide,
          totalSlides,
          goToSlide,
          nextSlide,
          prevSlide,
        }}
      >
        <div
          ref={ref}
          className={cn("relative overflow-hidden", className)}
        >
          <div
            ref={containerRef}
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {children}
          </div>
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-shrink-0 w-full", className)}
    {...props}
  />
))
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-shrink-0 w-full", className)}
    {...props}
  />
))
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { prevSlide } = useCarousel()
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute left-2 top-1/2 -translate-y-1/2",
        className
      )}
      onClick={prevSlide}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { nextSlide } = useCarousel()
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute right-2 top-1/2 -translate-y-1/2",
        className
      )}
      onClick={nextSlide}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

const CarouselIndicators = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { currentSlide, totalSlides, goToSlide } = useCarousel()
  return (
    <div
      ref={ref}
      className={cn("flex justify-center gap-2 mt-4", className)}
      {...props}
    >
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          className={cn(
            "w-2 h-2 rounded-full transition-colors",
            currentSlide === index
              ? "bg-yellow-500"
              : "bg-gray-300 dark:bg-gray-600"
          )}
          onClick={() => goToSlide(index)}
        />
      ))}
    </div>
  )
})
CarouselIndicators.displayName = "CarouselIndicators"

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselIndicators,
} 