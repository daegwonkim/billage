import { useEffect, useState } from 'react'
import { RentalItemList } from '@/components/main/RentalItemList'
import { Header } from '../components/common/Header'
import { CategoryList } from '../components/main/CategoryList'
import type { RentalItemCardViewModel } from '@/models/RentalItem'
import { getCategories, getRentalItems } from '@/api/main'
import type { CategoryViewModel } from '@/models/Category'
import { useNavigate } from 'react-router-dom'

export function Main() {
  const navigate = useNavigate()

  const onRentalItemClick = (rentalItemId: string) => {
    navigate(`/api/rental-items/${rentalItemId}`)
  }

  const [categories, setCategories] = useState<CategoryViewModel[]>([])
  const [rentalItems, setRentalItems] = useState<RentalItemCardViewModel[]>([])
  const [loading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const [categoriesData, rentalItemsData] = await Promise.all([
          getCategories(),
          getRentalItems()
        ])
        setCategories(categoriesData)
        setRentalItems(rentalItemsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <>
      <Header />
      <CategoryList categories={categories} />
      <RentalItemList
        rentalItems={rentalItems}
        onRentalItemClick={onRentalItemClick}
      />
    </>
  )
}
