import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  productTitle?: string
}

// Afbeeldingen (foto's én infographics) worden op natuurlijke verhouding
// getoond: geen vaste aspect-ratio, dus geen lege witte vlakken.
const ImageGallery = ({ images, productTitle }: ImageGalleryProps) => {
  const visible = images.filter((image) => !!image.url)

  return (
    <div className="flex flex-col w-full max-w-[720px] mx-auto gap-y-3 small:gap-y-4">
      {visible.map((image, index) => (
        <div
          key={image.id}
          id={image.id}
          className="w-full overflow-hidden rounded-xl border border-ui-border-base bg-white"
        >
          <Image
            src={image.url}
            alt={
              productTitle
                ? `${productTitle} – afbeelding ${index + 1} van ${visible.length}`
                : `Productafbeelding ${index + 1} van ${visible.length}`
            }
            width={0}
            height={0}
            sizes="(max-width: 720px) 100vw, 720px"
            className="block w-full h-auto"
            // Alleen de eerste afbeelding direct laden (LCP); de rest lazy.
            priority={index === 0}
            loading={index === 0 ? undefined : "lazy"}
          />
        </div>
      ))}
    </div>
  )
}

export default ImageGallery
