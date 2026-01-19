import { ChevronsLeft, EllipsisVertical, Share } from 'lucide-react'
import type { NavigateFunction } from 'react-router-dom'

interface RentalItemDetailHeaderProps {
  navigate: NavigateFunction
  onMenuClick: () => void
}

export function RentalItemDetailHeader({
  navigate,
  onMenuClick
}: RentalItemDetailHeaderProps) {
  return (
    <div className="sticky top-0 z-40 bg-transparent">
      <div className="absolute top-0 right-0 left-0 flex items-center justify-between px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full">
          <ChevronsLeft
            size={30}
            color="white"
            className="shrink-0"
          />
        </button>
      </div>
      <div className="absolute top-0 right-0 flex items-center justify-between px-4 py-3">
        <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full">
          <Share
            size={24}
            color="white"
            className="shrink-0"
          />
        </button>
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full">
          <EllipsisVertical
            size={24}
            color="white"
            className="shrink-0"
          />
        </button>
      </div>
    </div>
  )
}
