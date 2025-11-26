import { RentalItems } from '@/components/main/RentalItems'
import { Header } from '../components/common/Header'
import { RentalItemCategories } from '../components/main/RentalItemCategories'
import { useNavigate } from 'react-router-dom'
import { useRentalItemCategories } from '@/hooks/useRentalItemCategories'
import { useRentalItems } from '@/hooks/useRentalItems'

export function Main() {
  const navigate = useNavigate()

  const onRentalItemClick = (rentalItemId: string) => {
    navigate(`/api/rental-items/${rentalItemId}`)
  }

  const {
    data: rentalItemCategoriesData,
    isLoading: rentalItemCategoriesLoading,
    error: rentalItemCategoriesError
  } = useRentalItemCategories()

  const {
    data: rentalItemsData,
    isLoading: rentalItemsLoading,
    error: rentalItemsError
  } = useRentalItems()

  const isLoading = rentalItemCategoriesLoading || rentalItemsLoading
  const error = rentalItemCategoriesError || rentalItemsError

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error || !rentalItemCategoriesData || !rentalItemsData) {
    return <div>Error: {error?.message}</div>
  }

  return (
    <>
      <Header />
      <RentalItemCategories
        rentalItemCategories={rentalItemCategoriesData.rentalItemCategories}
      />
      <RentalItems
        rentalItems={rentalItemsData}
        onRentalItemClick={onRentalItemClick}
      />
    </>
  )
}
