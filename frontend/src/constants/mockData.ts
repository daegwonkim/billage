import hotIcon from '@/assets/hot.png'
import hoomIcon from '@/assets/home.png'
import travelIcon from '@/assets/travel.png'
import sportsIcon from '@/assets/sports.png'
import electronicsIcon from '@/assets/electronics.png'
import fashionIcon from '@/assets/fashion.png'
import granulationIcon from '@/assets/granulation.png'
import type { Category, Product } from '../types'

export const CATEGORIES: Category[] = [
  { icon: hotIcon, label: '인기상품' },
  { icon: hoomIcon, label: '가정용품' },
  { icon: travelIcon, label: '여행용품' },
  { icon: sportsIcon, label: '스포츠/운동' },
  { icon: electronicsIcon, label: '전자제품' },
  { icon: fashionIcon, label: '패션' },
  { icon: granulationIcon, label: '육아/교육' }
]

export const PRODUCTS: Product[] = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=300&fit=crop',
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
    image:
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
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
    image:
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=300&fit=crop',
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
    image:
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop',
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
    image:
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=300&fit=crop',
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
    image:
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop',
    title: '샤오미 미에어4 프로 공기청정기',
    location: '마포구 연남동',
    time: '1일전',
    priceDay: '3,000',
    priceWeek: '18,000',
    likes: 5,
    comments: 0,
    views: 10,
    rentals: 0
  }
]
