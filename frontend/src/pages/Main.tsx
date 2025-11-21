import { Header } from '../components/common/Header'
import { CategoryList } from '../components/home/CategoryList'
import { ProductList } from '../components/home/ProductList'
import { CATEGORIES, PRODUCTS } from '../constants/mockData'

export function Main() {
  return (
    <>
      <Header />
      <CategoryList categories={CATEGORIES} />
      <ProductList products={PRODUCTS} />
    </>
  )
}
