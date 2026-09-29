import { Heading, Text } from "@medusajs/ui"
import TransferActions from "@modules/order/components/transfer-actions"
import TransferImage from "@modules/order/components/transfer-image"

export default async function TransferPage({
  params,
}: {
  params: { id: string; token: string }
}) {
  const { id, token } = params

  return (
    <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        <Heading level="h1" className="text-xl text-zinc-900">
          Koppelverzoek voor bestelling {id}
        </Heading>
        <Text className="text-zinc-600">
          Je hebt een verzoek ontvangen om bestelling ({id}) aan een ander account te koppelen.
          Ga je akkoord? Keur het verzoek dan goed met de knop
          hieronder.
        </Text>
        <div className="w-full h-px bg-zinc-200" />
        <Text className="text-zinc-600">
          Als je akkoord gaat, beheert het nieuwe account deze bestelling
          vanaf nu.
        </Text>
        <Text className="text-zinc-600">
          Herken je dit verzoek niet? Dan hoef je
          niets te doen.
        </Text>
        <div className="w-full h-px bg-zinc-200" />
        <TransferActions id={id} token={token} />
      </div>
    </div>
  )
}
