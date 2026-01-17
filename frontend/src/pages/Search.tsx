import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { X, Search as SearchIcon, ChevronLeft } from 'lucide-react'
import { useGetRentalItems } from '@/hooks/useRentalItem'
import { RentalItemCard } from '@/components/main/RentalItemCard'

export function Search() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') ?? ''
  const [searchQuery, setSearchQuery] = useState(keyword)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetRentalItems('LATEST', undefined, keyword || undefined, {
      keepPreviousData: false
    })

  const items = data?.pages.flatMap(page => page.content) ?? []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchParams({ keyword: searchQuery.trim() }, { replace: true })
    }
  }

  return (
    <>
      {/* 검색 페이지 */}
      <div className="min-h-screen w-md bg-white shadow-xl">
        {/* 헤더 */}
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg p-1 transition-colors hover:bg-gray-100">
            <ChevronLeft
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
        <div className="h-full overflow-y-auto">
          {/* 검색어가 없을 때 */}
          {!keyword && (
            <div className="flex flex-col items-center justify-center py-20">
              <SearchIcon
                size={48}
                className="mb-4 text-gray-300"
                strokeWidth={1.5}
              />
              <p className="text-sm text-gray-500">검색어를 입력해주세요</p>
            </div>
          )}

          {/* 로딩 중 */}
          {keyword && isLoading && (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-gray-500">검색 중...</p>
            </div>
          )}

          {/* 검색 결과 */}
          {keyword && !isLoading && (
            <div>
              <p className="px-4 py-2 text-sm text-gray-500">
                '{keyword}' 검색 결과 {data?.pages[0]?.totalElements ?? 0}건
              </p>
              {items.length > 0 ? (
                <>
                  {items.map(item => (
                    <RentalItemCard
                      key={item.id}
                      rentalItem={item}
                      onClick={() => navigate(`/rental-items/${item.id}`)}
                    />
                  ))}
                  {hasNextPage && (
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="w-full py-4 text-sm text-gray-500 hover:bg-gray-50">
                      {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
                    </button>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <p className="text-sm text-gray-500">검색 결과가 없습니다</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
