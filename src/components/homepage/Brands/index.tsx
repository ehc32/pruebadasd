"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Collection {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  bgColor: string; // tailwind class e.g. bg-[#FFE5E5]
  textColor: string; // tailwind class e.g. text-black
}

const collections: Collection[] = [
  {
    id: "retail-sale",
    title: "Up to 80%",
    subtitle: "off retail",
    image: "/orange-basketball-illustration.jpg",
    bgColor: "bg-[#FFE5E5]",
    textColor: "text-black",
  },
  {
    id: "gift-choice",
    title: "Give the gift",
    subtitle: "of choice",
    image: "/dog-with-backpack.jpg",
    bgColor: "bg-[#FFF8E5]",
    textColor: "text-black",
  },
  {
    id: "top-brands-1",
    title: "The latest from",
    subtitle: "top brands",
    image: "/yellow-sweater-fashion.jpg",
    bgColor: "bg-[#FFFDF5]",
    textColor: "text-black",
  },
  {
    id: "top-brands-2",
    title: "The latest from",
    subtitle: "top brands",
    image: "/yellow-sweater-fashion.jpg",
    bgColor: "bg-[#FFFDF5]",
    textColor: "text-black",
  },
  {
    id: "top-brands-3",
    title: "The latest from",
    subtitle: "top brands",
    image: "/yellow-sweater-fashion.jpg",
    bgColor: "bg-[#FFFDF5]",
    textColor: "text-black",
  },
];

export default function CollectionsCarousel() {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(1);
  const trackRef = useRef<HTMLDivElement>(null);

  // responsive slides per view (1 / 2 / 3)
  useEffect(() => {
    const mqMd = window.matchMedia("(min-width: 768px)");
    const mqLg = window.matchMedia("(min-width: 1024px)");
    const compute = () => setPerView(mqLg.matches ? 3 : mqMd.matches ? 2 : 1);
    compute();
    mqMd.addEventListener("change", compute);
    mqLg.addEventListener("change", compute);
    return () => {
      mqMd.removeEventListener("change", compute);
      mqLg.removeEventListener("change", compute);
    };
  }, []);

  const lastIndex = collections.length - 1;

  const prev = () => setIndex((i) => (i === 0 ? lastIndex : i - 1));
  const next = () => setIndex((i) => (i === lastIndex ? 0 : i + 1));

  // translate percentage based on slides per view
  const translate = useMemo(() => `translateX(-${(index * 100) / perView}%)`, [index, perView]);

  // keyboard support when carousel is focused
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="py-12 px-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl">
            Discover more. <span className="text-muted-foreground">Good things are waiting for you!</span>
          </h2>
          <div className="hidden gap-2 md:flex">
            <Button aria-label="Previous" variant="outline" size="icon" onClick={prev} className="h-10 w-10 rounded-full bg-transparent">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button aria-label="Next" variant="outline" size="icon" onClick={next} className="h-10 w-10 rounded-full bg-transparent">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={trackRef}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Collections"
            className="overflow-hidden"
          >
            <div
              className="flex transition-transform duration-500 ease-out will-change-transform"
              style={{ transform: translate, width: `${(collections.length * 100) / perView}%` }}
            >
              {collections.map((c) => (
                <div
                  key={c.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${c.title} – ${c.subtitle}`}
                  className="p-2"
                  style={{ width: `${100 / collections.length}%` }}
                >
                  <div className={`${c.bgColor} relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-3xl p-8 transition-transform duration-300 hover:scale-[1.02]`}>
                    <div>
                      <p className="mb-2 text-sm font-medium uppercase tracking-wide opacity-70">Collection</p>
                      <h3 className={`mb-1 text-3xl font-bold ${c.textColor}`}>{c.title}</h3>
                      <p className={`text-3xl font-bold ${c.textColor}`}>{c.subtitle}</p>
                    </div>
                    <div className="flex items-end justify-between">
                      <Button variant="secondary" className="rounded-full bg-white px-6 font-medium text-black hover:bg-white/90">
                        See collection
                      </Button>
                      <div className="relative -mr-4 -mb-4 h-32 w-32">
                        <Image src={c.image || "/placeholder.svg"} alt={`${c.title} collection`} fill className="object-contain" sizes="(max-width: 768px) 6rem, (max-width: 1024px) 8rem, 8rem" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile nav */}
          <div className="mt-6 flex justify-center gap-2 md:hidden">
            <Button aria-label="Previous" variant="outline" size="icon" onClick={prev} className="h-10 w-10 rounded-full bg-transparent">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button aria-label="Next" variant="outline" size="icon" onClick={next} className="h-10 w-10 rounded-full bg-transparent">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Dots */}
          <div className="mt-4 flex justify-center gap-2">
            {collections.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full transition-opacity ${i === index ? "opacity-100" : "opacity-40"} bg-foreground`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}