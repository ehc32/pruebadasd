"use client"

import Image from "next/image"
import type React from "react"

import { useState, useEffect } from "react"

interface Slide {
  id: number
  headline: string
  description: string
  image: string
  ctaText: string
}

const slides: Slide[] = [
  {
    id: 1,
    headline: "Fresh finds for every occasion",
    description:
      "Explore our latest arrivals, curated to bring you style, functionality, and inspiration. Shop now and discover your next favorite.",
    image: "https://images.pexels.com/photos/210126/pexels-photo-210126.jpeg?_gl=1*vvnvbd*_ga*OTQ5NDc2NTk4LjE3NjI2NTQyNDI.*_ga_8JE65Q40S6*czE3NjI2NTc3NTckbzIkZzEkdDE3NjI2NTc3OTUkajIyJGwwJGgw",
    ctaText: "Shop Now",
  },
  {
    id: 2,
    headline: "Elevate your space",
    description: "Transform your home with our carefully selected collection of modern and elegant pieces.",
    image: "https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?_gl=1*mnzw9t*_ga*OTQ5NDc2NTk4LjE3NjI2NTQyNDI.*_ga_8JE65Q40S6*czE3NjI2NTc3NTckbzIkZzEkdDE3NjI2NTc4ODMkajU4JGwwJGgw",
    ctaText: "Explore Collection",
  },
  {
    id: 3,
    headline: "Design meets function",
    description: "Discover products that blend beautiful design with practical functionality for your everyday life.",
    image: "https://images.pexels.com/photos/383634/pexels-photo-383634.jpeg?_gl=1*zfnxnn*_ga*OTQ5NDc2NTk4LjE3NjI2NTQyNDI.*_ga_8JE65Q40S6*czE3NjI2NTc3NTckbzIkZzEkdDE3NjI2NTc5MDkkajMyJGwwJGgw",
    ctaText: "Shop Now",
  },
]

const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <div className="relative w-full h-[600px] sm:h-[700px] lg:h-[800px] overflow-hidden bg-[#F5F1EB] dark:bg-neutral-900">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Background with Image and Overlay */}
            <div className="relative w-full h-full">
              <div className="absolute inset-0">
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.headline}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                {/* Subtle gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
              </div>

              {/* Content - Left Side */}
              <div className="relative z-10 h-full flex items-center px-6 sm:px-12 lg:px-20 xl:px-24">
                <div className="max-w-2xl space-y-6 sm:space-y-8">
                  {/* Headline - Serif Font */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-normal text-white leading-tight tracking-tight text-balance">
                    {slide.headline}
                  </h1>

                  {/* Description - Sans-serif Font */}
                  <p className="text-sm sm:text-base lg:text-lg text-white/90 max-w-xl leading-relaxed font-sans">
                    {slide.description}
                  </p>

                  {/* CTA Button */}
                  <button className="bg-white text-gray-900 px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]">
                    {slide.ctaText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 left-6 sm:left-12 lg:left-20 xl:left-24 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-500 ease-out ${
              index === currentSlide
                ? "w-12 h-0.5 bg-white rounded-full"
                : "w-12 h-0.5 bg-white/40 rounded-full hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-8 right-6 sm:right-12 lg:right-20 xl:right-24 flex items-center gap-4 text-white z-20">
        <span className="text-sm font-medium tracking-wider">
          {String(currentSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>
        <button
          onClick={nextSlide}
          className="w-10 h-10 flex items-center justify-center border border-white/60 hover:border-white hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Next slide"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6 4L10 8L6 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default HeroCarousel
