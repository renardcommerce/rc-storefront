"use client"

import ErrorView from "@modules/common/components/error-view"

export default function Error(props: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorView {...props} />
}
