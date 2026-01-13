import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Search as SearchIcon } from 'lucide-react'

interface SearchProps {
  isOpen: boolean
  onClose: () => void
}

export function Search({ isOpen, onClose }: SearchProps) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // TODO: 검색 로직 구현
      console.log('검색:', searchQuery)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* 검색 페이지 */}
      <div className="fixed top-0 left-1/2 z-50 h-full w-md bg-white shadow-xl">
        {/* 헤더 */}
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
          <button
            onClick={onClose}
            className="rounded-lg p-1 transition-colors hover:bg-gray-100">
            <X
              size={24}
              className="text-gray-700"
            />
          </button>

          {/* 검색 입력 */}
          <form
            onSubmit={handleSearch}
            className="flex flex-1 items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
            <SearchIcon
              size={20}
              className="text-gray-500"
            />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="검색어를 입력하세요"
              className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="rounded-full p-0.5 transition-colors hover:bg-gray-200">
                <X
                  size={16}
                  className="text-gray-500"
                />
              </button>
            )}
          </form>
        </div>

        {/* 검색 내용 */}
        <div className="h-full overflow-y-auto p-4">
          {/* 검색어가 없을 때 */}
          {!searchQuery && (
            <div className="flex flex-col items-center justify-center py-20">
              <SearchIcon
                size={48}
                className="mb-4 text-gray-300"
                strokeWidth={1.5}
              />
              <p className="text-sm text-gray-500">검색어를 입력해주세요</p>
            </div>
          )}

          {/* 검색 결과 (TODO: 실제 검색 결과로 교체) */}
          {searchQuery && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">'{searchQuery}' 검색 결과</p>
              {/* 검색 결과 리스트가 여기에 들어갑니다 */}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
