const SkeletonLineItem = () => {
  return (
    <li className="flex w-full gap-x-4 py-4">
      <div className="h-20 w-20 shrink-0 rounded-large bg-bone animate-pulse" />
      <div className="flex flex-1 flex-col gap-y-2">
        <div className="h-4 w-40 rounded bg-bone animate-pulse" />
        <div className="h-4 w-24 rounded bg-bone animate-pulse" />
      </div>
    </li>
  )
}

export default SkeletonLineItem
