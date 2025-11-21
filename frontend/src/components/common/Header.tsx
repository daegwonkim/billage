import { Search, Bell, ShoppingBag } from 'lucide-react'
import icon from '@/assets/main.png'

export function Header() {
  return (
    <div
      style={{
        backgroundColor: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px'
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <img
            src={icon}
            width={35}
            height={35}
          />
          <h1 style={{ fontSize: '20px', margin: 0, fontFamily: 'Paperozi' }}>
            빌리지
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Search
            size={20}
            color="#666"
          />
          <div style={{ position: 'relative' }}>
            <ShoppingBag
              size={20}
              color="#666"
            />
            <div
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: '#ef4444',
                color: 'white',
                fontSize: '10px',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
              3
            </div>
          </div>
          <Bell
            size={20}
            color="#666"
          />
        </div>
      </div>
    </div>
  )
}
