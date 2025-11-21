import type { Category } from '@/types'

interface CategoryListProps {
  categories: Category[]
}

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div
      style={{
        backgroundColor: 'white',
        overflowX: 'auto',
        padding: '12px 16px',
        borderTop: '1px solid #f0f0f0'
      }}>
      <div style={{ display: 'flex', gap: '24px', minWidth: 'max-content' }}>
        {categories.map((cat, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative'
            }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '6px',
                position: 'relative'
              }}>
              <img
                src={cat.icon}
                alt={cat.label}
                width={35}
                height={35}
              />
            </div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#333',
                whiteSpace: 'nowrap'
              }}>
              {cat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
