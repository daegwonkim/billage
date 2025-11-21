import type { Product } from '../../types'
import { ProductCard } from './ProductCard'

interface ProductListProps {
  products: Product[]
}

export function ProductList({ products }: ProductListProps) {
  return (
    <div style={{ paddingBottom: '80px' }}>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  )
}
