import hotIcon from '@/assets/category/hot.png'
import hoomIcon from '@/assets/category/home.png'
import travelIcon from '@/assets/category/travel.png'
import sportsIcon from '@/assets/category/sports.png'
import electronicsIcon from '@/assets/category/electronics.png'
import fashionIcon from '@/assets/category/fashion.png'
import granulationIcon from '@/assets/category/granulation.png'
import type { Category } from '../types'
import type {
  RentalItemCardViewModel,
  RentalItemDetailViewModel
} from '@/models/RentalItem'

export const CATEGORIES: Category[] = [
  { icon: hotIcon, label: '인기상품' },
  { icon: hoomIcon, label: '가정용품' },
  { icon: travelIcon, label: '여행용품' },
  { icon: sportsIcon, label: '스포츠/운동' },
  { icon: electronicsIcon, label: '전자제품' },
  { icon: fashionIcon, label: '패션' },
  { icon: granulationIcon, label: '육아/교육' }
]

export const RENTAL_ITEMS: RentalItemCardViewModel[] = [
  {
    id: '1',
    thumbnail:
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=300&fit=crop',
    name: '안드로이드11 스마트티비 4K 43',
    address: '마포구 서교동',
    pricePerDay: 3000,
    pricePerWeek: 18000,
    likes: 3,
    comments: 0,
    rentals: 0,
    createdAt: new Date()
  },
  {
    id: '2',
    thumbnail:
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
    name: '르메르 크루아상 미디엄 숄더백',
    address: '마포구 연남동',
    pricePerDay: 10000,
    pricePerWeek: 50000,
    likes: 12,
    comments: 3,
    rentals: 3,
    createdAt: new Date()
  },
  {
    id: '3',
    thumbnail:
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=300&fit=crop',
    name: '플레이스테이션5 디지털에디션 + 듀얼센스 2개 (게임 많아요1)',
    address: '강동구 고덕동',
    pricePerDay: 3000,
    pricePerWeek: 18000,
    likes: 16,
    comments: 5,
    rentals: 4,
    createdAt: new Date()
  },
  {
    id: '4',
    thumbnail:
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop',
    name: '샤오미 미에어4 프로 공기청정기',
    address: '마포구 연남동',
    pricePerDay: 3000,
    pricePerWeek: 18000,
    likes: 1,
    comments: 0,
    rentals: 0,
    createdAt: new Date()
  },
  {
    id: '5',
    thumbnail:
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=300&fit=crop',
    name: '플레이스테이션5 디지털에디션 + 듀얼센스 2개 (게임 많아요1)',
    address: '강동구 고덕동',
    pricePerDay: 3000,
    pricePerWeek: 18000,
    likes: 16,
    comments: 5,
    rentals: 5,
    createdAt: new Date()
  },
  {
    id: '6',
    thumbnail:
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop',
    name: '샤오미 미에어4 프로 공기청정기',
    address: '마포구 연남동',
    pricePerDay: 3000,
    pricePerWeek: 18000,
    likes: 5,
    comments: 0,
    rentals: 0,
    createdAt: new Date()
  }
]

export const RENTAL_ITEM_DETAIL: RentalItemDetailViewModel = {
  id: '1',
  seller: {
    id: '1',
    name: '콩뇽',
    address: '영등포구 당산동',
    profileImage:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    dealSatisfaction: 99
  },
  category: '패션',
  name: '아더에러 트레이스 크로스백',
  description: `아더에러 트레이스 크로스백 쉐어링해요 ㅎㅎ
      정식 명칭: ADER Trace admore crossbody bag Noir

      21F/W 싱품으로 사진과 같이 블랙 색상입니다!

      노트북 때문에 백팩을 자주 메서 올려용

      가방 특성상 실밥이 나와있는 부분이 있어서 그 부분만 조심해서 사용해주시면 될 것 같습니다 :)
    `,
  images: [
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop'
  ],
  pricePerDay: 4000,
  pricePerWeek: 20000,
  isLiked: true,
  likes: 16,
  comments: 5,
  rentals: 3,
  views: 233,
  createdAt: new Date()
}
