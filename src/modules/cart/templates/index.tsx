import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="py-8 small:py-12">
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <>
            <p className="eyebrow mb-2">Bestelling</p>
            <h1 className="mb-6 text-2xl small:text-4xl font-semibold tracking-tight text-ink small:mb-10">
              Winkelwagen
            </h1>
            <div className="grid grid-cols-1 small:grid-cols-[minmax(0,1fr)_380px] gap-6 small:gap-10 items-start">
              <div className="flex min-w-0 flex-col gap-y-4">
                {!customer && <SignInPrompt />}
                <div className="rounded-large bg-white p-5 small:p-8 shadow-card">
                  <ItemsTemplate cart={cart} />
                </div>
              </div>
              {cart.region && (
                <div className="rounded-large bg-white p-5 small:p-8 shadow-card small:sticky small:top-40">
                  <Summary cart={cart as any} />
                </div>
              )}
            </div>
          </>
        ) : (
          <EmptyCartMessage />
        )}
      </div>
    </div>
  )
}

export default CartTemplate
