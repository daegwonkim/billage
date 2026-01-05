import { Search, Bell } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div
            className="m-0 text-lg font-bold"
            style={{ fontFamily: 'Paperozi' }}>
            BILLAGE
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="cursor-pointer border-none bg-transparent p-0 text-gray-600 transition-colors hover:text-black">
            <Search
              size={22}
              strokeWidth={1.5}
            />
          </button>
          <button className="cursor-pointer border-none bg-transparent p-0 text-gray-600 transition-colors hover:text-black">
            <Bell
              size={22}
              strokeWidth={1.5}
            />
          </button>
        </div>
      </div>
    </header>
  )
}
