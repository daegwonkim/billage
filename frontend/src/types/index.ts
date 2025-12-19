import popularIcon from '../assets/category/popular.png'
import householdIcon from '../assets/category/household.png'
import travelIcon from '../assets/category/travel.png'
import sportsIcon from '../assets/category/sports.png'
import electronicsIcon from '../assets/category/electronics.png'
import fashionIcon from '../assets/category/fashion.png'
import childcareIcon from '../assets/category/childcare.png'

export interface Category {
  icon: string
  label: string
  value: string
}

export type NavTab = 'home' | 'category' | 'add' | 'chat' | 'my'

export const categories: Category[] = [
  { icon: popularIcon, label: '인기상품', value: 'POPULAR' },
  { icon: householdIcon, label: '가정용품', value: 'HOUSEHOLD' },
  { icon: travelIcon, label: '여행용품', value: 'TRAVEL' },
  { icon: sportsIcon, label: '스포츠/운동', value: 'SPORTS' },
  { icon: electronicsIcon, label: '전자기기', value: 'ELECTRONICS' },
  { icon: fashionIcon, label: '패션잡화', value: 'FASHION' },
  { icon: childcareIcon, label: '육아/교육', value: 'CHILDCARE' }
]
