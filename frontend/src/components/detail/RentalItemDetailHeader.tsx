import { Undo2 } from 'lucide-react'
import type { NavigateFunction } from 'react-router-dom'

interface RentalItemDetailHeaderProps {
  navigate: NavigateFunction
}

export function RentalItemDetailHeader({
  navigate
}: RentalItemDetailHeaderProps) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'transparent'
      }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
          <Undo2
            size={24}
            color="white"
            style={{ flexShrink: 0 }}
          />
        </button>
      </div>
    </div>
  )
}
