import { ArrowUpRightMini } from "@medusajs/icons"
import { Text } from "@medusajs/ui"
import { ACCOUNT_LINK_COLOR } from "@lib/util/link-colors"
import LocalizedClientLink from "../localized-client-link"

type InteractiveLinkProps = {
  href: string
  children?: React.ReactNode
  onClick?: () => void
}

const InteractiveLink = ({
  href,
  children,
  onClick,
  ...props
}: InteractiveLinkProps) => {
  return (
    <LocalizedClientLink
      className="flex gap-x-1 items-center group min-h-[44px] -my-[11px]"
      href={href}
      onClick={onClick}
      {...props}
    >
      <Text style={{ color: ACCOUNT_LINK_COLOR }}>{children}</Text>
      <ArrowUpRightMini
        className="group-hover:rotate-45 ease-in-out duration-150"
        color={ACCOUNT_LINK_COLOR}
      />
    </LocalizedClientLink>
  )
}

export default InteractiveLink
