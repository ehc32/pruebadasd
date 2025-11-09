"use client";

import Image from "next/image";
import Link from "next/link";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";

type HeroHighlight = {
  title: string;
  subtitle: string;
};

type HeroContent = {
  imageSrc: string;
  imageAlt: string;
  heading: string;
  description: string;
  highlights?: HeroHighlight[];
};

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  hero?: HeroContent;
};

export function AuthLayout({ title, subtitle, children, footer, hero }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-100 text-foreground dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col overflow-hidden border border-border/60 bg-background/80 shadow-xl lg:flex-row">
        <div className="flex w-full flex-col px-6 py-10 sm:px-12 lg:w-1/2 lg:py-16">
          <Link
            href="/"
            className={cn([
              integralCF.className,
              "text-2xl font-semibold uppercase tracking-tight text-foreground md:text-3xl",
            ])}
          >
            SHOP.CO
          </Link>

          <div className="mt-10 flex-1">
            <div className="rounded-3xl border border-border/60 bg-background/90 p-8 shadow-lg">
              <div className="space-y-2 text-left">
                <h1 className="text-3xl font-semibold text-foreground md:text-4xl">{title}</h1>
                <p className="text-sm text-muted-foreground md:text-base">{subtitle}</p>
              </div>
              <div className="mt-8 space-y-6">{children}</div>
            </div>
            {footer && (
              <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
            )}
          </div>
        </div>

        {hero && (
          <aside className="relative hidden w-full flex-1 overflow-hidden lg:flex">
            <Image
              src={hero.imageSrc}
              alt={hero.imageAlt}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/20 to-emerald-500/30" />
            <div className="relative z-10 flex h-full w-full flex-col justify-between p-12 text-white">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/80">Tu estilo, a tu medida</p>
                <h2 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">
                  {hero.heading}
                </h2>
                <p className="mt-4 max-w-md text-base text-white/80">{hero.description}</p>
              </div>

              {hero.highlights && hero.highlights.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {hero.highlights.map((highlight) => (
                    <div
                      key={highlight.title}
                      className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm"
                    >
                      <p className="text-2xl font-semibold">{highlight.title}</p>
                      <p className="text-sm text-white/80">{highlight.subtitle}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

