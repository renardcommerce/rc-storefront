import { Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="h-[60vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 gap-4">
        <Heading
          level="h1"
          className="text-4xl small:text-5xl leading-tight text-ui-fg-base font-normal"
        >
          De juiste kabel. Meteen geregeld.
        </Heading>

        <p className="text-lg text-ui-fg-subtle max-w-2xl">
          Betrouwbare HDMI-, DisplayPort-, USB- en netwerkkabels van RC Choice.
        </p>
      </div>
    </div>
  )
}

export default Hero
