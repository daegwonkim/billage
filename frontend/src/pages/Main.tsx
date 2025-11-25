import { RentalItemList } from '@/components/main/RentalItemList'
import { Header } from '../components/common/Header'
import { CategoryList } from '../components/main/CategoryList'
import { getCategories, getRentalItems } from '@/api/main'
import { useNavigate } from 'react-router-dom'
import { useFetch } from '@/hooks/useFetch'

export function Main() {
  const navigate = useNavigate()

  const onRentalItemClick = (rentalItemId: string) => {
    navigate(`/api/rental-items/${rentalItemId}`)
  }

  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError
  } = useFetch(getCategories)

  const {
    data: rentalItemsData,
    loading: rentalItemsLoading,
    error: rentalItemsError
  } = useFetch(() => getRentalItems())

  const loading = categoriesLoading || rentalItemsLoading
  const error = categoriesError || rentalItemsError

  if (loading) {
    return <div>Loading...</div>
  }

  if (error || !categoriesData || !rentalItemsData) {
    return <div>Error: {error}</div>
  }

  return (
    <>
      <Header />
      <CategoryList categories={categoriesData.categories} />
      <RentalItemList
        rentalItems={rentalItemsData}
        onRentalItemClick={onRentalItemClick}
      />
    </>
  )
}
