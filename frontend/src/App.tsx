import { useState } from 'react';
import { Search, Home, Calendar, PlusCircle, MessageCircle, User, Bell, ShoppingBag, MapPin, Package, MessageCircleMore, Heart } from 'lucide-react';
import { categories } from './components/CategoryList';
import icon from './assets/main.png';

interface Product {
  id: number;
  image: string;
  title: string;
  location: string;
  time?: string;
  priceDay: string;
  priceWeek: string;
  likes: number;
  comments?: number;
  views: number;
  rentals: number;
}

export default function MarketplaceApp() {
  const [activeTab, setActiveTab] = useState('home');

  const products: Product[] = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=300&fit=crop',
      title: '안드로이드11 스마트티비 4K 43',
      location: '마포구 서교동',
      time: '30분 전',
      priceDay: '3,000',
      priceWeek: '18,000',
      likes: 3,
      comments: 0,
      views: 5,
      rentals: 0
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
      title: '르메르 크루아상 미디엄 숄더백',
      location: '마포구 연남동',
      time: '1시간 전',
      priceDay: '10,000',
      priceWeek: '50,000',
      likes: 12,
      comments: 3,
      views: 210,
      rentals: 3
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=300&fit=crop',
      title: '플레이스테이션5 디지털에디션 + 듀얼센스 2개 (게임 많아요1)',
      location: '강동구 고덕동',
      time: '1시간 전',
      priceDay: '3,000',
      priceWeek: '18,000',
      likes: 16,
      comments: 5,
      views: 320,
      rentals: 4
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop',
      title: '샤오미 미에어4 프로 공기청정기',
      location: '마포구 연남동',
      time: '1일전',
      priceDay: '3,000',
      priceWeek: '18,000',
      likes: 1,
      comments: 0,
      views: 10,
      rentals: 0
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=300&fit=crop',
      title: '플레이스테이션5 디지털에디션 + 듀얼센스 2개 (게임 많아요1)',
      location: '강동구 고덕동',
      time: '1시간 전',
      priceDay: '3,000',
      priceWeek: '18,000',
      likes: 16,
      comments: 5,
      views: 100,
      rentals: 5
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop',
      title: '샤오미 미에어4 프로 공기청정기',
      location: '마포구 연남동',
      time: '1일전',
      priceDay: '3,000',
      priceWeek: '18,000',
      likes: 5,
      comments: 0,
      views: 10,
      rentals: 0
    },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#f5f5f5', minHeight: '100vh', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ width: '100%', maxWidth: '480px', backgroundColor: '#f5f5f5', fontFamily: 'system-ui, -apple-system, sans-serif', position: 'relative' }}>
        {/* Header */}
        <div style={{ backgroundColor: 'white', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <img src={icon} width={35} height={35} />
              <h1 style={{ fontSize: '20px', margin: 0, fontFamily: 'Paperozi' }}>빌리지</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Search size={20} color="#666" />
              <div style={{ position: 'relative' }}>
                <ShoppingBag size={20} color="#666" />
                <div style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#ef4444', color: 'white', fontSize: '10px', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
              </div>
              <Bell size={20} color="#666" />
            </div>
          </div>

          {/* Categories */}
          <div style={{ overflowX: 'auto', padding: '12px 16px', borderTop: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', gap: '24px', minWidth: 'max-content' }}>
              {categories.map((cat, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '6px', position: 'relative' }}>
                    <img src={cat.icon} alt={cat.label} width={35} height={35} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#333', whiteSpace: 'nowrap' }}>{cat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products */}
        <div style={{ paddingBottom: '65px' }}>
          {products.map((product) => (
            <div key={product.id} style={{ height: '144px', backgroundColor: 'white', marginBottom: '4px', padding: '16px' }}>
              <div style={{ height: '144px', display: 'flex', gap: '12px' }}>
                <div style={{ width: '144px' }}>
                  <img 
                    src={product.image} 
                    alt={product.title}
                    style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '6px 0px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.title}</h3>

                  <div style={{ position: 'relative', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                      <MapPin size={18} color='#3b82f6' />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.location}</span>
                      {product.time && (
                        <>
                          <span style={{ margin: '0 4px' }}>|</span>
                          <span>{product.time}</span>
                        </>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{product.priceDay}</span>
                      <span style={{ fontSize: '14px', color: '#666' }}>원 / 일</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{product.priceWeek}</span>
                      <span style={{ fontSize: '14px', color: '#666' }}>원 / 주</span>
                    </div>

                    <div style={{ position: 'absolute', bottom: 0, right: 0, display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#8B939F' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Package size={18} />
                        {product.rentals}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <MessageCircleMore size={18} />
                        {product.comments}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                        <Heart size={18} />
                        {product.likes}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Nav */}
        <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', backgroundColor: 'white', borderTop: '1px solid #e5e5e5' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', height: '64px' }}>
            {[
              { id: 'home', icon: Home, label: '홈' },
              { id: 'category', icon: Calendar, label: '커뮤니티' },
              { id: 'add', icon: PlusCircle, label: '등록' },
              { id: 'chat', icon: MessageCircle, label: '채팅' },
              { id: 'my', icon: User, label: 'My 빌리지' }
            ].map(({ id, icon: Icon, label }) => (
              <button 
                key={id}
                onClick={() => setActiveTab(id)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', border: 'none', background: 'none', color: activeTab === id ? '#ef4444' : '#999', cursor: 'pointer' }}
              >
                <Icon size={24} />
                <span style={{ fontSize: '11px' }}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}