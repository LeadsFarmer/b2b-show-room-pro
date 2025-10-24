"use client"

import { Heading } from "@medusajs/ui"
import Image from "next/image"

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-neutral-100">
      <Image
        src="/hero-image.jpg"
        alt="ShowRoomPro - Votre plateforme B2B"
        layout="fill"
        quality={100}
        priority
      />
      <div className="absolute inset-0 z-1 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <p className="text-neutral-600 text-xs uppercase">
            Votre partenaire B2B de confiance
          </p>

          <Heading
            level="h1"
            className="text-6xl leading-10 text-ui-fg-base font-normal mt-10 mb-5"
          >
            ShowRoomPro
          </Heading>

          <p className="leading-10 text-ui-fg-subtle font-normal text-lg">
            Plateforme de commandes professionnelles nouvelle génération
          </p>
        </span>
      </div>
    </div>
  )
}

export default Hero
